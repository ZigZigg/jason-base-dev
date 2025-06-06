import { NextRequest, NextResponse } from 'next/server';
import { 
  CognitoIdentityProviderClient, 
  AdminCreateUserCommand,
  AdminGetUserCommand,
  MessageActionType,
  AdminSetUserPasswordCommand,
  AdminAddUserToGroupCommand
} from '@aws-sdk/client-cognito-identity-provider';
import { generateRandomPassword } from '@/app/lib/password-utils';

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

interface MicrosoftTokenResponse {
  access_token: string;
  id_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token?: string;
}

interface MicrosoftUserInfo {
  id: string;
  displayName: string;
  givenName: string;
  surname: string;
  userPrincipalName: string;
  mail: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      console.error('Microsoft OAuth error:', error);
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=microsoft_oauth_error`);
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
    
    // Get user info from Microsoft Graph API
    const userInfo = await getMicrosoftUserInfo(tokenResponse.access_token);
    
    // Create or update user in Cognito
    const cognitoUser = await createOrUpdateCognitoUser(userInfo);
    
    // Create a temporary token for NextAuth session creation
    const sessionToken = Buffer.from(JSON.stringify({
      microsoftTokens: tokenResponse,
      userInfo: userInfo,
      cognitoUser: cognitoUser
    })).toString('base64');

    // Redirect to a page that will handle NextAuth session creation
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/api/auth/microsoft-session?token=${sessionToken}`);
    
  } catch (error) {
    console.error('Microsoft callback error:', error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=microsoft_callback_error`);
  }
}

async function exchangeCodeForTokens(code: string): Promise<MicrosoftTokenResponse> {
  const tokenEndpoint = `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID}/oauth2/v2.0/token`;
  
  const body = new URLSearchParams({
    client_id: process.env.MICROSOFT_CLIENT_ID!,
    client_secret: process.env.MICROSOFT_CLIENT_SECRET!,
    code: code,
    grant_type: 'authorization_code',
    redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/microsoft-callback`,
    scope: 'openid email profile User.Read'
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

async function getMicrosoftUserInfo(accessToken: string): Promise<MicrosoftUserInfo> {
  const response = await fetch('https://graph.microsoft.com/v1.0/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get user info from Microsoft Graph');
  }

  return await response.json();
}

async function createOrUpdateCognitoUser(userInfo: MicrosoftUserInfo) {
  const email = userInfo.mail || userInfo.userPrincipalName;
  
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
      // Create new user
      const createUserCommand = new AdminCreateUserCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID!,
        Username: email,
        UserAttributes: [
          { Name: 'email', Value: email },
          { Name: 'email_verified', Value: 'true' },
          { Name: 'name', Value: userInfo.displayName },
        ],
        MessageAction: MessageActionType.SUPPRESS, // Don't send welcome email
        TemporaryPassword: generateRandomPassword(),
      });

      const newUser = await cognitoClient.send(createUserCommand);
      
      // Explicitly confirm the user (sets UserStatus to CONFIRMED)
      const confirmUserCommand = new AdminSetUserPasswordCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID!,
        Username: email,
        Password: generateRandomPassword(),
        Permanent: true,
      });
      
      await cognitoClient.send(confirmUserCommand);
      
      // Add user to groups
      await assignUserToGroups(email);
      
      console.log('Created new Cognito user:', newUser.User?.Username);
      return newUser.User;
    }
    
    throw error;
  }
}

// Function to handle group assignment
async function assignUserToGroups(username: string) {
  try {
    // Determine which group(s) to assign based on business logic
    
    const addToGroupCommand = new AdminAddUserToGroupCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID!,
      Username: username,
      GroupName: process.env.MICROSOFT_GROUP!,
    });
    
    await cognitoClient.send(addToGroupCommand);
    console.log(`Added user ${username} to group: ap-southeast-1_tCICVsRRZ_jscogtestid`);
  } catch (error) {
    console.error('Error adding user to groups:', error);
    // Don't throw error - user creation should still succeed even if group assignment fails
  }
}
