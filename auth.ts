"use server";

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { authConfig } from "@/auth.config";
import { getUserByEmail } from "@/app/lib/data";
import { signInSchema } from "@/schemas";

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = signInSchema.safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUserByEmail(email);
          if (!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (!passwordsMatch) return null;
          if (!user.isVerified) return null;

          return {
            id: user._id.toString(),
            email: user.email,
            password: user.password,
          };
        }

        return null;
      },
    }),
  ],
});
