import { NextRequest, NextResponse } from 'next/server';
import { 
  CognitoIdentityProviderClient, 
  AdminCreateUserCommand,
  AdminGetUserCommand,
  AdminAddUserToGroupCommand,
  AdminSetUserPasswordCommand,
  MessageActionType
} from '@aws-sdk/client-cognito-identity-provider';
import { generateRandomPassword } from '@/app/lib/password-utils';

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token?: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      console.error('Google OAuth error:', error);
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=google_oauth_error`);
    }

    if (!code) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=missing_code`);
    }

    // Basic state validation (you can enhance this with session storage)
    if (!state || state.length < 10) {
      console.error('Invalid or missing state parameter');
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=invalid_state`);
    }

    // Exchange authorization code for tokens
    const tokenResponse = await exchangeCodeForTokens(code);
    
    // Get user info from Google API
    const userInfo = await getGoogleUserInfo(tokenResponse.access_token);
    
    // Create or update user in Cognito
    const cognitoUser = await createOrUpdateCognitoUser(userInfo);
    
    // Create a temporary token for NextAuth session creation
    const sessionToken = Buffer.from(JSON.stringify({
      googleTokens: tokenResponse,
      userInfo: userInfo,
      cognitoUser: cognitoUser
    })).toString('base64');

    // Redirect to a page that will handle NextAuth session creation
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/api/auth/google-session?token=${sessionToken}`);
    
  } catch (error) {
    console.error('Google callback error:', error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=google_callback_error`);
  }
}

async function exchangeCodeForTokens(code: string): Promise<GoogleTokenResponse> {
  const tokenEndpoint = 'https://oauth2.googleapis.com/token';
  
  const body = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    code: code,
    grant_type: 'authorization_code',
    redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/google-callback`,
  });

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Token exchange failed: ${errorData}`);
  }

  return await response.json();
}

async function getGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get user info from Google API');
  }

  return await response.json();
}

async function createOrUpdateCognitoUser(userInfo: GoogleUserInfo) {
  const email = userInfo.email;
  
  try {
    // Try to get existing user
    const getUserCommand = new AdminGetUserCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID!,
      Username: email,
    });
    
    const existingUser = await cognitoClient.send(getUserCommand);
    console.log('User already exists in Cognito:', existingUser.Username);
    return existingUser;
    
  } catch (error: any) {
    if (error.name === 'UserNotFoundException') {
      // Create new user with external provider confirmation
      const createUserCommand = new AdminCreateUserCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID!,
        Username: email,
        UserAttributes: [
          { Name: 'email', Value: email },
          { Name: 'email_verified', Value: 'true' }, // Google has verified the email
          { Name: 'name', Value: userInfo.name },
        ],
        MessageAction: MessageActionType.SUPPRESS, // Don't send welcome email
        TemporaryPassword: generateRandomPassword(),
      });

      const newUser = await cognitoClient.send(createUserCommand);
      
      // Set permanent password (user won't use this, but Cognito requires it)
      const setPasswordCommand = new AdminSetUserPasswordCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID!,
        Username: email,
        Password: generateRandomPassword(),
        Permanent: true,
      });
      
      await cognitoClient.send(setPasswordCommand);
      
      // Add user to groups
      await assignUserToGroups(email);
      
      console.log('Created and confirmed new Cognito user via Google:', newUser.User?.Username);
      return newUser.User;
    }
    
    throw error;
  }
}

// Function to handle group assignment
async function assignUserToGroups(username: string) {
  try {
    const addToGroupCommand = new AdminAddUserToGroupCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID!,
      Username: username,
      GroupName: process.env.GOOGLE_GROUP!,
    });
    
    await cognitoClient.send(addToGroupCommand);
    console.log(`Added user ${username} to group: ${process.env.GOOGLE_GROUP!}`);
  } catch (error) {
    console.error('Error adding user to groups:', error);
    // Don't throw error - user creation should still succeed even if group assignment fails
  }
}