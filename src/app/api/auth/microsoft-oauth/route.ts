import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Microsoft OAuth 2.0 authorization endpoint - use 'common' for multi-tenant
    const microsoftAuthUrl = new URL(`https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID}/oauth2/v2.0/authorize`);
    
    // Generate state for CSRF protection
    const state = generateState();
    
    // Add required parameters
    microsoftAuthUrl.searchParams.append('client_id', process.env.MICROSOFT_CLIENT_ID!);
    microsoftAuthUrl.searchParams.append('response_type', 'code');
    microsoftAuthUrl.searchParams.append('redirect_uri', `${process.env.NEXTAUTH_URL}/api/auth/microsoft-callback`);
    microsoftAuthUrl.searchParams.append('scope', 'openid email profile User.Read');
    microsoftAuthUrl.searchParams.append('response_mode', 'query');
    microsoftAuthUrl.searchParams.append('state', state);
    
    return NextResponse.json({
      authUrl: microsoftAuthUrl.toString(),
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

// Generate a random state parameter for CSRF protection
function generateState(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
} 