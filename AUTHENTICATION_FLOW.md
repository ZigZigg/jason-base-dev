# Authentication Flow Documentation

## Complete Authentication Flow Diagram

This document shows the authentication flows implemented in the Jason Learning application with AWS Cognito and NextAuth.

## 1. Overall Authentication Architecture

```mermaid
graph TB
    A[User] --> B[Next.js App]
    B --> C[NextAuth.js]
    C --> D[AWS Cognito]
    C --> E[Custom Credentials Provider]
    D --> F[Microsoft OAuth]
    D --> G[Google OAuth]
    D --> H[Cognito User Pool]
    
    subgraph "Authentication Methods"
        I[Email/Password Direct]
        J[Microsoft OAuth via Cognito]
        K[Google OAuth via Cognito]
        L[Custom Credentials Fallback]
    end
```

## 2. Detailed Authentication Flows

### 2.1 Direct Email/Password Login Flow

```mermaid
sequenceDiagram
    participant U as User
    participant App as Next.js App
    participant API as /api/auth/cognito-signin
    participant Cognito as AWS Cognito
    participant NA as NextAuth
    participant Session as Session Storage

    U->>App: Enter email/password
    App->>API: POST /api/auth/cognito-signin
    API->>Cognito: InitiateAuth (SRP_A)
    Cognito-->>API: Challenge Response
    API->>Cognito: RespondToAuthChallenge
    Cognito-->>API: Access/ID/Refresh Tokens
    API-->>App: Return tokens + user info
    App->>NA: signIn('login', {cognitoTokens})
    NA->>NA: JWT callback processes tokens
    NA-->>Session: Create session with user data
    Session-->>App: Authenticated session
    App->>App: Redirect to /subjects
```

### 2.2 Microsoft OAuth Flow

```mermaid
sequenceDiagram
    participant U as User
    participant App as Next.js App
    participant MSAuth as /api/auth/microsoft-oauth
    participant MS as Microsoft OAuth
    participant MSSession as /api/auth/microsoft-session
    participant MSPage as /auth/microsoft-signin
    participant NA as NextAuth
    participant Session as Session Storage

    U->>App: Click "Continue with Microsoft"
    App->>MSAuth: GET /api/auth/microsoft-oauth
    MSAuth-->>App: Return Microsoft OAuth URL
    App->>MS: Redirect to Microsoft OAuth
    MS->>U: Microsoft login page
    U->>MS: Authenticate with Microsoft
    MS->>MSSession: Callback with auth code
    MSSession->>MS: Exchange code for tokens
    MS-->>MSSession: Return tokens + user info
    MSSession->>MSSession: Create session data
    MSSession-->>MSPage: Redirect with encoded tokens
    MSPage->>NA: signIn('login', {cognitoTokens})
    NA->>NA: Process mock Cognito tokens
    NA-->>Session: Create session
    Session-->>App: Authenticated session
    App->>App: Redirect to /subjects
```

### 2.3 Google OAuth Flow

```mermaid
sequenceDiagram
    participant U as User
    participant App as Next.js App
    participant GAuth as /api/auth/google-oauth
    participant G as Google OAuth
    participant GSession as /api/auth/google-session
    participant GPage as /auth/google-signin
    participant NA as NextAuth
    participant Session as Session Storage

    U->>App: Click "Continue with Google"
    App->>GAuth: GET /api/auth/google-oauth
    GAuth-->>App: Return Google OAuth URL
    App->>G: Redirect to Google OAuth
    G->>U: Google login page
    U->>G: Authenticate with Google
    G->>GSession: Callback with auth code
    GSession->>G: Exchange code for tokens
    G-->>GSession: Return tokens + user info
    GSession->>GSession: Create session data
    GSession-->>GPage: Redirect with encoded tokens
    GPage->>NA: signIn('login', {cognitoTokens})
    NA->>NA: Process mock Cognito tokens
    NA-->>Session: Create session
    Session-->>App: Authenticated session
    App->>App: Redirect to /subjects
```

### 2.4 User Registration Flow

```mermaid
sequenceDiagram
    participant U as User
    participant App as Next.js App
    participant API as /api/auth/cognito-signup
    participant Cognito as AWS Cognito
    participant Lambda as PostConfirmation Lambda
    participant Email as Email Service

    U->>App: Fill registration form
    App->>API: POST /api/auth/cognito-signup
    API->>Cognito: SignUpCommand
    Cognito->>Email: Send verification email
    Cognito-->>API: Return UserSub
    API->>Cognito: AdminConfirmSignUpCommand
    Cognito->>Lambda: Trigger PostConfirmation
    Lambda-->>Cognito: Process user confirmation
    Cognito-->>API: User confirmed
    API-->>App: Registration successful
    App->>App: Redirect to login
```

## 3. NextAuth Configuration Flow

```mermaid
graph TB
    subgraph "NextAuth Providers"
        A[CognitoProvider]
        B[Credentials Provider 'login']
        C[Credentials Provider 'signup']
    end
    
    subgraph "Callbacks"
        D[JWT Callback]
        E[Session Callback]
        F[Redirect Callback]
    end
    
    subgraph "Pages"
        G[Custom Login: /login]
        H[Custom Signup: /signup]
        I[Microsoft Auth: /auth/microsoft-signin]
    end
    
    A --> D
    B --> D
    C --> D
    D --> E
    E --> Session[User Session]
    
    G --> B
    H --> C
    I --> B
```

## 4. Middleware Protection Flow

```mermaid
graph LR
    A[Incoming Request] --> B{Has Valid Token?}
    B -->|No| C{Is Auth Route?}
    C -->|No| D[Redirect to /login]
    C -->|Yes| E[Allow Access]
    B -->|Yes| F{Is Login Route?}
    F -->|Yes| G[Redirect to /subjects]
    F -->|No| H{Is Root Route?}
    H -->|Yes| I[Redirect to /subjects]
    H -->|No| E
    
    subgraph "Protected Routes"
        J[/subjects]
        K[/dashboard]
        L[Any non-auth route]
    end
    
    subgraph "Auth Routes (Excluded)"
        M[/login]
        N[/signup]
        O[/auth/microsoft-signin]
        P[/auth/google-signin]
        Q[/api/auth/*]
    end
```

## 5. Token Management Flow

```mermaid
sequenceDiagram
    participant App as Next.js App
    participant NA as NextAuth JWT
    participant Token as JWT Token
    participant Session as User Session

    Note over App,Session: Initial Authentication
    App->>NA: User authenticates
    NA->>Token: Store tokens in JWT
    Token->>Session: Create session object
    
    Note over App,Session: Subsequent Requests
    App->>NA: getToken() / getSession()
    NA->>Token: Decode JWT
    Token->>NA: Return token data
    NA->>Session: Build session object
    Session-->>App: Return user session
    
    Note over App,Session: Token Refresh (if implemented)
    Token->>Token: Check expiry
    Token->>NA: Refresh if needed
    NA->>Session: Update session
```

## 6. Error Handling Flow

```mermaid
graph TB
    A[Authentication Error] --> B{Error Type}
    
    B -->|Invalid Credentials| C[Show error message]
    B -->|Network Error| D[Show retry option]
    B -->|OAuth Error| E[Redirect to login with error]
    B -->|Session Expired| F[Clear session & redirect]
    B -->|Lambda Error| G[Log error & fallback]
    
    C --> H[Stay on current page]
    D --> I[Allow retry]
    E --> J[Show error notification]
    F --> K[Force re-authentication]
    G --> L[Continue without Lambda features]
```

## Key Components

- **NextAuth.js**: Handles session management and authentication flow
- **AWS Cognito**: Primary identity provider for email/password auth
- **Microsoft/Google OAuth**: Social login providers
- **Custom Credentials Provider**: Fallback and token processing
- **Middleware**: Route protection and authentication checks
- **Custom Pages**: Login/signup forms with social login options

## Security Features

1. **JWT Strategy**: Secure token storage in HTTP-only cookies
2. **Route Protection**: Middleware enforces authentication
3. **Token Validation**: JWT parsing and validation
4. **Secure Redirects**: Controlled post-auth navigation
5. **Error Handling**: Graceful error management and user feedback 