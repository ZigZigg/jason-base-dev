// Avoid use any check @typescript-eslint/no-explicit-any


import { authOptions } from "@/app/lib/auth";
import NextAuth from "next-auth";
declare module "next-auth" {
    interface Session {
      user: {
        id: string;
        name: string;
        email: string;
        role: string;
        avatar?: string;
        fullName?: string;
      };
      accessToken: string;
    }
  }
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

