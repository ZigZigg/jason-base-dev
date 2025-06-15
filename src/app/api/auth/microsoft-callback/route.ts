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
  MicrosoftUserInfo
} from '@/app/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      return handleOAuthError(error, 'Microsoft');
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
      `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID}/oauth2/v2.0/token`,
      process.env.MICROSOFT_CLIENT_ID!,
      process.env.MICROSOFT_CLIENT_SECRET!,
      `${process.env.NEXTAUTH_URL}/api/auth/microsoft-callback`,
      { scope: 'openid email profile User.Read' }
    );
    
    // Get user info from Microsoft Graph API using common utility
    const userInfo = await fetchUserInfo<MicrosoftUserInfo>(
      tokenResponse.access_token,
      'https://graph.microsoft.com/v1.0/me'
    );
    
    // Create or update user in Cognito using common utility
    const email = userInfo.mail || userInfo.userPrincipalName;
    const userAttributes = [
      { Name: 'email', Value: email },
      { Name: 'email_verified', Value: 'true' },
      { Name: 'name', Value: userInfo.displayName },
    ];
    
    const cognitoUser = await createOrUpdateCognitoUser(
      email,
      userAttributes,
      process.env.MICROSOFT_GROUP
    );
    
    // Create a temporary token for NextAuth session creation
    const sessionToken = createSessionToken({
      microsoftTokens: tokenResponse,
      userInfo: userInfo,
      cognitoUser: cognitoUser
    });

    // Redirect to a page that will handle NextAuth session creation
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/api/auth/microsoft-session?token=${sessionToken}`);
    
  } catch (error) {
    return handleCallbackError(error, 'Microsoft');
  }
}
