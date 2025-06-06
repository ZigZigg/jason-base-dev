import { Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import CognitoProvider from "next-auth/providers/cognito";

export const authOptions = {
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID!,
      clientSecret: process.env.COGNITO_CLIENT_SECRET!,
      issuer: process.env.COGNITO_ISSUER!,
      checks: ["pkce", "state"],
    }),
    Credentials({
      id: "login", // Unique ID for login provider
      name: "Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        cognitoTokens: { label: "Cognito Tokens", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          throw new Error("Email is required");
        }

        try {
         // If Cognito tokens are provided, use them to create session
         if (credentials.cognitoTokens) {
          const tokens = JSON.parse(credentials.cognitoTokens);
          
          // Parse the ID token to get user info
          if (tokens.idToken) {
            const payload = parseJwt(tokens.idToken);
            
            return {
              user: {
                id: payload.sub,
                name: payload.name || payload.given_name || payload.email,
                email: payload.email,
                role: payload["custom:role"] || "user",
                fullName: payload.name || `${payload.given_name || ""} ${payload.family_name || ""}`.trim(),
                avatar: payload.picture,
              },
              token: tokens.accessToken,
              idToken: tokens.idToken,
              refreshToken: tokens.refreshToken,
            };
          }
        }

        // Fallback to mock user (you can remove this later)
        return {
          user: {
            id: "1",
            name: "Test User",
            email: credentials.email,
            role: "admin",
            avatar: "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-173524.jpg",
            fullName: "John Doe",
          },
          token: process.env.JASON_PARTNER_API_KEY,
        } as any;
        } catch (error) {
          console.error("Login error:", error);
          throw new Error("Invalid credentials");
        }
      },
    }),
    Credentials({
      id: "signup", // Unique ID for signup provider
      name: "Signup",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
      },
      async authorize() {
        try {
          // const response = await fetch("https://api.custom.com/signup", {
          //   method: "POST",
          //   headers: {
          //     "Content-Type": "application/json",
          //   },
          //   body: JSON.stringify(credentials),
          // });

          // if (response.ok) {
          //   const user = await response.json();
          //   return user; // Return user data including token
          // }
          // return null; // Return null if signup fails
          return {
            user:{
              id: "1",
              name: "Test User",
              email: "john.doe@example.com",
              avatar: "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-173524.jpg",
              fullName: "Test User",
            },
            token: process.env.JASON_PARTNER_API_KEY,
          } as any
        } catch (error) {
          console.error("Signup error:", error);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" as const },
  callbacks: {
    async jwt({ token, user, account }: { token: any; user: any; account: any }) {
      // Handle Cognito provider
      if (account?.provider === "cognito") {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
        token.refreshToken = account.refresh_token;
        
        // Extract user info from Cognito token
        if (account.id_token) {
          const payload = parseJwt(account.id_token);
          token.user = {
            id: payload.sub,
            name: payload.name || payload.given_name || payload.email,
            email: payload.email,
            role: payload["custom:role"] || "user",
            fullName: payload.name || `${payload.given_name || ""} ${payload.family_name || ""}`.trim(),
            avatar: payload.picture,
          };
        }
      }
      // Handle credentials provider
      else if (user?.user) {
        token.user = user.user;
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: any }) {

      session.user = token.user; // Include user data in the session
      session.accessToken = token.accessToken; // Include the token in the session
      return session;
    },
    // async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
    //   console.log("🚀 ~ redirect ~ url: ->>>", url)
    //   // Handle post-login redirects
    //   if (url.startsWith("/")) return `${baseUrl}${url}`;
    //   else if (new URL(url).origin === baseUrl) return url;
    //   return baseUrl + "/subjects";
    // },
  },
  pages: {
    signIn: "/login", // Custom login page
    newUser: "/signup", // Custom signup page
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Helper function to parse JWT
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return {};
  }
}