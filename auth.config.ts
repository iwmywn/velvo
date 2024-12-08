import type { NextAuthConfig } from "next-auth";
import jwt from "jsonwebtoken";

export const authConfig: NextAuthConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/user/signin",
  },
  cookies: {
    sessionToken: {
      name: "__Secure-next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isSignedIn = !!auth?.user;

      if (
        nextUrl.pathname.startsWith("/user/account") ||
        nextUrl.pathname.startsWith("/user/purchase")
      ) {
        if (isSignedIn) return true;
        return false;
        // return Response.redirect(new URL("/user/signin", nextUrl));
      } else if (isSignedIn) return Response.redirect(new URL("/", nextUrl));
      return true;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  jwt: {
    encode: async ({ token, secret }) => {
      if (!token || !secret) throw new Error("Token or secret missing");
      return jwt.sign(token, secret as string, {
        algorithm: "HS256",
      });
    },
    decode: async ({ token, secret }) => {
      if (!token || !secret) return null;
      try {
        return jwt.verify(token, secret as string) as Record<string, unknown>;
      } catch (error) {
        console.error("JWT decode error:", error);
        return null;
      }
    },
  },
  providers: [],
};
