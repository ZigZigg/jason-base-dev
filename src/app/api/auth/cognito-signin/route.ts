import { NextRequest, NextResponse } from 'next/server';
import { 
  InitiateAuthCommand,
  AuthFlowType 
} from '@aws-sdk/client-cognito-identity-provider';
import { 
  cognitoClient, 
  calculateSecretHash, 
  handleCognitoError, 
  validateInput 
} from '@/app/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input using common function
    validateInput({ email, password }, ['email', 'password']);

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

    const response = await cognitoClient.send(command);

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
    // Handle validation errors
    if (error.message.includes('Missing required fields')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    // Use common error handler for Cognito errors
    return handleCognitoError(error, 'signin');
  }
} 