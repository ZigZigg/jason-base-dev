import { NextRequest, NextResponse } from 'next/server';
import { 
  CognitoIdentityProviderClient, 
  SignUpCommand,
  AdminConfirmSignUpCommand
} from '@aws-sdk/client-cognito-identity-provider';

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, confirmPassword } = await request.json();

    // Validate input
    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters, contain at least one uppercase and one lowercase letter' },
        { status: 400 }
      );
    }

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
    const result = await client.send(signUpCommand);
    console.log("🚀 ~ POST ~ result:", result)

    const result2 = await client.send(
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
    console.error('Cognito signup error:', error);
    
    // Handle specific Cognito errors
    if (error.name === 'UsernameExistsException') {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    if (error.name === 'InvalidPasswordException') {
      return NextResponse.json(
        { error: 'Password does not meet requirements' },
        { status: 400 }
      );
    }
    
    if (error.name === 'InvalidParameterException') {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
} 