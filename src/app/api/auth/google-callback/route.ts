import { NextRequest, NextResponse } from 'next/server';
import { 
  exchangeOAuthCode,
  fetchUserInfo,
  createOrUpdateCognitoUser,
  createSessionToken,
  handleOAuthError,
  handleMissingCode,
  handleInvalidState,
  handleCallbackError,
  GoogleUserInfo
} from '@/app/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      return handleOAuthError(error, 'Google');
    }

    if (!code) {
      return handleMissingCode();
    }

    // Basic state validation (you can enhance this with session storage)
    if (!state || state.length < 10) {
      return handleInvalidState();
    }

    // Exchange authorization code for tokens using common utility
    const tokenResponse = await exchangeOAuthCode(
      code,
      'https://oauth2.googleapis.com/token',
      process.env.GOOGLE_CLIENT_ID!,
      process.env.GOOGLE_CLIENT_SECRET!,
      `${process.env.NEXTAUTH_URL}/api/auth/google-callback`
    );
    
    // Get user info from Google API using common utility
    const userInfo = await fetchUserInfo<GoogleUserInfo>(
      tokenResponse.access_token,
      'https://www.googleapis.com/oauth2/v2/userinfo'
    );
    
    // Create or update user in Cognito using common utility
    const userAttributes = [
      { Name: 'email', Value: userInfo.email },
      { Name: 'email_verified', Value: 'true' }, // Google has verified the email
      { Name: 'name', Value: userInfo.name },
    ];
    
    const cognitoUser = await createOrUpdateCognitoUser(
      userInfo.email,
      userAttributes,
      process.env.GOOGLE_GROUP
    );
    
    // Create a temporary token for NextAuth session creation
    const sessionToken = createSessionToken({
      googleTokens: tokenResponse,
      userInfo: userInfo,
      cognitoUser: cognitoUser
    });

    // Redirect to a page that will handle NextAuth session creation
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/api/auth/google-session?token=${sessionToken}`);
    
  } catch (error) {
    return handleCallbackError(error, 'Google');
  }
}