import { NextRequest, NextResponse } from 'next/server';
import { 
  SignUpCommand,
  AdminConfirmSignUpCommand
} from '@aws-sdk/client-cognito-identity-provider';
import { 
  cognitoClient, 
  handleCognitoError, 
  validateInput, 
  validatePassword 
} from '@/app/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, confirmPassword } = await request.json();

    // Validate input using common functions
    validateInput({ name, email, password, confirmPassword }, ['name', 'email', 'password', 'confirmPassword']);
    validatePassword(password, confirmPassword);

    // Sign up user in Cognito
    const signUpParams = {
      ClientId: process.env.COGNITO_CLIENT_ID!,
      Username: email.trim(),
      Password: password,
      UserAttributes: [
        {
          Name: 'email',
          Value: email.trim()
        },
        {
          Name: 'name',
          Value: name.trim()
        },
        {
          Name: 'given_name',
          Value: name.trim()
        },
      ]
    };

    const signUpCommand = new SignUpCommand(signUpParams);
    const result = await cognitoClient.send(signUpCommand);
    console.log("🚀 ~ POST ~ result:", result)

    const result2 = await cognitoClient.send(
      new AdminConfirmSignUpCommand({
        UserPoolId: 'ap-southeast-1_tCICVsRRZ',
        Username: email.trim()
      })
    );
    console.log("🚀 ~ POST ~ result2:", result2)

    return NextResponse.json({
      success: true,
      message: 'User registered successfully. Please check your email for verification.',
      userSub: result.UserSub,
      needsVerification: !result.UserConfirmed
    });

  } catch (error: any) {
    // Handle validation errors
    if (error.message.includes('Missing required fields') || 
        error.message.includes('Passwords do not match') || 
        error.message.includes('Password must be')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    // Use common error handler for Cognito errors
    return handleCognitoError(error, 'signup');
  }
} 