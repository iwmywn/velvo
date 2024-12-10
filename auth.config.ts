import type { NextAuthConfig } from "next-auth";

export default {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/user/signin",
  },
  providers: [],
} satisfies NextAuthConfig;
