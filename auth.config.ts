import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/user/signin",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isSignedIn = !!auth?.user;
      if (
        nextUrl.pathname.startsWith("/user/account") ||
        nextUrl.pathname.startsWith("/user/purchase")
      ) {
        return isSignedIn;
      } else if (isSignedIn) {
        return Response.redirect(new URL("/", nextUrl));
      }
      return true;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  jwt: {
    encode: async ({ token, secret }) => {
      const encoder = new TextEncoder();
      const header = encoder.encode(
        JSON.stringify({ alg: "HS256", typ: "JWT" }),
      );
      const payload = encoder.encode(
        JSON.stringify({
          ...token,
          exp: 24 * 60 * 60,
        }),
      );
      const base64UrlEncode = (input: Uint8Array) =>
        btoa(String.fromCharCode(...input))
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "");
      const encodedHeader = base64UrlEncode(header);
      const encodedPayload = base64UrlEncode(payload);

      return `${encodedHeader}.${encodedPayload}`;
    },
    decode: async ({ token, secret }) => {
      try {
        if (!token) return null;

        const [encodedHeader, encodedPayload] = token.split(".");
        const decodedPayload = JSON.parse(atob(encodedPayload));
        return decodedPayload;
      } catch (error) {
        console.error("JWT decode error:", error);
        return null;
      }
    },
  },
  providers: [],
};
