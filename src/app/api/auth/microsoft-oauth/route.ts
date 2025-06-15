import { NextResponse } from 'next/server';
import { buildOAuthUrl } from '@/app/lib/auth-utils';

export async function GET() {
  try {
    // Build Microsoft OAuth URL using common utility
    const authUrl = buildOAuthUrl(
      `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID}/oauth2/v2.0/authorize`,
      process.env.MICROSOFT_CLIENT_ID!,
      `${process.env.NEXTAUTH_URL}/api/auth/microsoft-callback`,
      'openid email profile User.Read',
      { response_mode: 'query' }
    );
    
    // Extract state from the URL for response
    const urlObj = new URL(authUrl);
    const state = urlObj.searchParams.get('state');
    
    return NextResponse.json({
      authUrl: authUrl,
      state: state // Return state for validation if needed
    });
    
  } catch (error) {
    console.error('Microsoft OAuth URL generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate Microsoft OAuth URL' },
      { status: 500 }
    );
  }
}

 