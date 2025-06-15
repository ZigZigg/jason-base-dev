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
    const { userInfo, googleTokens } = sessionData;

    // Create a mock Cognito token structure for NextAuth
    const mockCognitoTokens = {
      accessToken: googleTokens.access_token,
      idToken: googleTokens.id_token,
      refreshToken: googleTokens.refresh_token || null,
    };

    // Redirect to a client-side page that will handle the NextAuth sign-in
    const redirectUrl = new URL('/auth/google-signin', process.env.NEXTAUTH_URL!);
    redirectUrl.searchParams.append('email', userInfo.email);
    redirectUrl.searchParams.append('tokens', createSessionToken(mockCognitoTokens));
    redirectUrl.searchParams.append('userInfo', createSessionToken(userInfo));

    return NextResponse.redirect(redirectUrl.toString());
    
  } catch (error) {
    console.error('Google session creation error:', error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=session_creation_error`);
  }
} 