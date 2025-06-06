import { NextRequest, NextResponse } from 'next/server';
import { 
  CognitoIdentityProviderClient, 
  InitiateAuthCommand,
  AuthFlowType 
} from '@aws-sdk/client-cognito-identity-provider';
import { createHmac } from 'crypto';

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Helper function to calculate SECRET_HASH if client secret is provided
function calculateSecretHash(username: string, clientId: string, clientSecret: string): string {
  return createHmac('sha256', clientSecret)
    .update(username + clientId)
    .digest('base64');
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Prepare authentication parameters
    const authParams: Record<string, string> = {
      USERNAME: email.trim(),
      PASSWORD: password,
    };

    // Add SECRET_HASH if client secret is configured
    if (process.env.COGNITO_CLIENT_SECRET) {
      authParams.SECRET_HASH = calculateSecretHash(
        email.trim(),
        process.env.COGNITO_CLIENT_ID!,
        process.env.COGNITO_CLIENT_SECRET
      );
    }

    // Initiate authentication
    const command = new InitiateAuthCommand({
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: process.env.COGNITO_CLIENT_ID!,
      AuthParameters: authParams,
    });

    const response = await client.send(command);

    // Check if authentication was successful
    if (response.AuthenticationResult) {
      const { AccessToken, IdToken, RefreshToken } = response.AuthenticationResult;
      
      return NextResponse.json({
        success: true,
        tokens: {
          accessToken: AccessToken,
          idToken: IdToken,
          refreshToken: RefreshToken,
        },
        message: 'Authentication successful'
      });
    }

    // Handle challenges (MFA, new password required, etc.)
    if (response.ChallengeName) {
      return NextResponse.json({
        success: false,
        challenge: response.ChallengeName,
        challengeParameters: response.ChallengeParameters,
        session: response.Session,
        message: `Challenge required: ${response.ChallengeName}`
      }, { status: 202 }); // 202 Accepted - additional action needed
    }

    // Unknown response
    return NextResponse.json(
      { error: 'Authentication failed - unknown response' },
      { status: 400 }
    );

  } catch (error: any) {
    console.error('Cognito signin error:', error);
    
    // Handle specific Cognito errors
    if (error.name === 'NotAuthorizedException') {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    if (error.name === 'UserNotConfirmedException') {
      return NextResponse.json(
        { error: 'Please verify your email before signing in' },
        { status: 403 }
      );
    }
    
    if (error.name === 'UserNotFoundException') {
      return NextResponse.json(
        { error: 'No account found with this email' },
        { status: 404 }
      );
    }

    if (error.name === 'TooManyRequestsException') {
      return NextResponse.json(
        { error: 'Too many attempts. Please try again later' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Authentication failed' },
      { status: 500 }
    );
  }
} 