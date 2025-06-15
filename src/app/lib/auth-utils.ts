import { NextResponse } from 'next/server';
import { 
  CognitoIdentityProviderClient, 
  AdminCreateUserCommand,
  AdminGetUserCommand,
  AdminSetUserPasswordCommand,
  AdminAddUserToGroupCommand,
  MessageActionType
} from '@aws-sdk/client-cognito-identity-provider';
import { createHmac } from 'crypto';
import { generateRandomPassword } from '@/app/lib/password-utils';

// Common types
export interface TokenResponse {
  access_token: string;
  id_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token?: string;
}

export interface BaseUserInfo {
  id: string;
  email: string;
  name: string;
}

export interface GoogleUserInfo extends BaseUserInfo {
  verified_email: boolean;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export interface MicrosoftUserInfo extends BaseUserInfo {
  displayName: string;
  givenName: string;
  surname: string;
  userPrincipalName: string;
  mail: string;
}

// Initialize Cognito client
export const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Common error handlers
export function handleCognitoError(error: any, operation: string) {
  console.error(`Cognito ${operation} error:`, error);
  
  const errorMap: Record<string, { message: string; status: number }> = {
    NotAuthorizedException: { message: 'Invalid email or password', status: 401 },
    UserNotConfirmedException: { message: 'Please verify your email before signing in', status: 403 },
    UserNotFoundException: { message: 'No account found with this email', status: 404 },
    TooManyRequestsException: { message: 'Too many attempts. Please try again later', status: 429 },
    UsernameExistsException: { message: 'User with this email already exists', status: 409 },
    InvalidPasswordException: { message: 'Password does not meet requirements', status: 400 },
    InvalidParameterException: { message: 'Invalid email format', status: 400 },
  };

  const errorInfo = errorMap[error.name];
  if (errorInfo) {
    return NextResponse.json({ error: errorInfo.message }, { status: errorInfo.status });
  }

  return NextResponse.json(
    { error: error.message || `${operation} failed` },
    { status: 500 }
  );
}

// Generate CSRF state
export function generateState(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Calculate SECRET_HASH for Cognito
export function calculateSecretHash(username: string, clientId: string, clientSecret: string): string {
  return createHmac('sha256', clientSecret)
    .update(username + clientId)
    .digest('base64');
}

// Common OAuth token exchange
export async function exchangeOAuthCode(
  code: string,
  tokenEndpoint: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string,
  additionalParams: Record<string, string> = {}
): Promise<TokenResponse> {
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code: code,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
    ...additionalParams,
  });

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Token exchange failed: ${errorData}`);
  }

  return await response.json();
}

// Generic user info fetcher
export async function fetchUserInfo<T>(
  accessToken: string,
  userInfoEndpoint: string
): Promise<T> {
  const response = await fetch(userInfoEndpoint, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get user info from ${userInfoEndpoint}`);
  }

  return await response.json();
}

// Generic Cognito user creation/update
export async function createOrUpdateCognitoUser(
  email: string,
  userAttributes: Array<{ Name: string; Value: string }>,
  groupName?: string
) {
  try {
    // Try to get existing user
    const getUserCommand = new AdminGetUserCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID!,
      Username: email,
    });
    
    const existingUser = await cognitoClient.send(getUserCommand);
    console.log('User already exists in Cognito:', existingUser.Username);
    return existingUser;
    
  } catch (error: any) {
    if (error.name === 'UserNotFoundException') {
      // Create new user
      const createUserCommand = new AdminCreateUserCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID!,
        Username: email,
        UserAttributes: userAttributes,
        MessageAction: MessageActionType.SUPPRESS,
        TemporaryPassword: generateRandomPassword(),
      });

      const newUser = await cognitoClient.send(createUserCommand);
      
      // Set permanent password
      const setPasswordCommand = new AdminSetUserPasswordCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID!,
        Username: email,
        Password: generateRandomPassword(),
        Permanent: true,
      });
      
      await cognitoClient.send(setPasswordCommand);
      
      // Add user to group if specified
      if (groupName) {
        await assignUserToGroup(email, groupName);
      }
      
      console.log('Created new Cognito user:', newUser.User?.Username);
      return newUser.User;
    }
    
    throw error;
  }
}

// Group assignment helper
export async function assignUserToGroup(username: string, groupName: string) {
  try {
    const addToGroupCommand = new AdminAddUserToGroupCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID!,
      Username: username,
      GroupName: groupName,
    });
    
    await cognitoClient.send(addToGroupCommand);
    console.log(`Added user ${username} to group: ${groupName}`);
  } catch (error) {
    console.error('Error adding user to groups:', error);
    // Don't throw error - user creation should still succeed even if group assignment fails
  }
}

// OAuth redirect handlers
export function handleOAuthError(error: string, provider: string) {
  console.error(`${provider} OAuth error:`, error);
  return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=${provider.toLowerCase()}_oauth_error`);
}

export function handleMissingCode() {
  return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=missing_code`);
}

export function handleInvalidState() {
  console.error('Invalid or missing state parameter');
  return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=invalid_state`);
}

export function handleCallbackError(error: any, provider: string) {
  console.error(`${provider} callback error:`, error);
  return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=${provider.toLowerCase()}_callback_error`);
}

// Session token creation
export function createSessionToken(tokenData: any): string {
  return Buffer.from(JSON.stringify(tokenData)).toString('base64');
}

// Session data parsing
export function parseSessionToken(token: string) {
  return JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
}

// Validation helpers
export function validateInput(fields: Record<string, any>, requiredFields: string[]) {
  const missing = requiredFields.filter(field => !fields[field]);
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
}

export function validatePassword(password: string, confirmPassword?: string) {
  if (confirmPassword && password !== confirmPassword) {
    throw new Error('Passwords do not match');
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
  if (!passwordRegex.test(password)) {
    throw new Error('Password must be at least 6 characters, contain at least one uppercase and one lowercase letter');
  }
}

// OAuth URL builders
export function buildOAuthUrl(
  authEndpoint: string,
  clientId: string,
  redirectUri: string,
  scope: string,
  additionalParams: Record<string, string> = {}
): string {
  const authUrl = new URL(authEndpoint);
  const state = generateState();
  
  authUrl.searchParams.append('client_id', clientId);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('redirect_uri', redirectUri);
  authUrl.searchParams.append('scope', scope);
  authUrl.searchParams.append('state', state);
  
  Object.entries(additionalParams).forEach(([key, value]) => {
    authUrl.searchParams.append(key, value);
  });
  
  return authUrl.toString();
} 