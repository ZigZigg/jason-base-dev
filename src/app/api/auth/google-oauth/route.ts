import { NextResponse } from 'next/server';
import { buildOAuthUrl } from '@/app/lib/auth-utils';

export async function GET() {
  try {
    // Build Google OAuth URL using common utility
    const authUrl = buildOAuthUrl(
      'https://accounts.google.com/o/oauth2/v2/auth',
      process.env.GOOGLE_CLIENT_ID!,
      `${process.env.NEXTAUTH_URL}/api/auth/google-callback`,
      'openid email profile',
      { access_type: 'offline' }
    );
    
    // Extract state from the URL for response
    const urlObj = new URL(authUrl);
    const state = urlObj.searchParams.get('state');
    
    return NextResponse.json({
      authUrl: authUrl,
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

 