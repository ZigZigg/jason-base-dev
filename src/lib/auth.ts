import { Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";


export const authOptions = {
  providers: [
    Credentials({
      id: "login", // Unique ID for login provider
      name: "Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize() {
        // const baseUrl = process.env.API_ENDPOINT;

        try {
          // const response = await fetch(`${baseUrl}/admin/auth/login`, {
          //   method: "POST",
          //   headers: {
          //     "Content-Type": "application/json",
          //   },
          //   body: JSON.stringify(credentials),
          // });

          // if (response.ok) {
          //   const result = await response.json();
          //   if(result.code !== 200 || !result.data) {
          //     return Promise.reject(new Error(result.message || "Login failed"));
          //   }

          //   return result.data; // Return user data
          // }
          return {
            user:{
              id: "1",
              name: "Test User",
              email: "john.doe@example.com",
              role: "admin",
              avatar: "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-173524.jpg",
              fullName: "John Doe",
            },
            token: process.env.JASON_PARTNER_API_KEY,
          } as any
        } catch (error) {
          console.error("Login error:", error);
          return null;
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
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.user = user?.user; // Store user data in the token
        token.accessToken = user?.token; // Store the token from the API response
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: any }) {

      session.user = token.user; // Include user data in the session
      session.accessToken = token.accessToken; // Include the token in the session
      return session;
    },
  },
  pages: {
    signIn: "/login", // Custom login page
    newUser: "/signup", // Custom signup page
  },
  secret: process.env.NEXTAUTH_SECRET,
};