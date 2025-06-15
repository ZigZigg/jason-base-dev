import { NextRequest, NextResponse } from 'next/server';
import { parseSessionToken, createSessionToken } from '@/app/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=missing_session_token`);
    }

    // Decode the session data using common utility
    const sessionData = parseSessionToken(token);
    const { userInfo, microsoftTokens } = sessionData;

    // Create a mock Cognito token structure for NextAuth
    const mockCognitoTokens = {
      accessToken: microsoftTokens.access_token,
      idToken: microsoftTokens.id_token,
      refreshToken: microsoftTokens.refresh_token || null,
    };

    // Redirect to a client-side page that will handle the NextAuth sign-in
    const redirectUrl = new URL('/auth/microsoft-signin', process.env.NEXTAUTH_URL!);
    redirectUrl.searchParams.append('email', userInfo.mail || userInfo.userPrincipalName);
    redirectUrl.searchParams.append('tokens', createSessionToken(mockCognitoTokens));
    redirectUrl.searchParams.append('userInfo', createSessionToken(userInfo));

    return NextResponse.redirect(redirectUrl.toString());
    
  } catch (error) {
    console.error('Microsoft session creation error:', error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=session_creation_error`);
  }
} 