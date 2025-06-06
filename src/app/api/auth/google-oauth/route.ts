import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Google OAuth 2.0 authorization endpoint
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    
    // Generate state for CSRF protection
    const state = generateState();
    
    // Add required parameters
    googleAuthUrl.searchParams.append('client_id', process.env.GOOGLE_CLIENT_ID!);
    googleAuthUrl.searchParams.append('response_type', 'code');
    googleAuthUrl.searchParams.append('redirect_uri', `${process.env.NEXTAUTH_URL}/api/auth/google-callback`);
    googleAuthUrl.searchParams.append('scope', 'openid email profile');
    googleAuthUrl.searchParams.append('access_type', 'offline');
    googleAuthUrl.searchParams.append('state', state);
    
    return NextResponse.json({
      authUrl: googleAuthUrl.toString(),
      state: state // Return state for validation if needed
    });
    
  } catch (error) {
    console.error('Google OAuth URL generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate Google OAuth URL' },
      { status: 500 }
    );
  }
}

// Generate a random state parameter for CSRF protection
function generateState(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
} 