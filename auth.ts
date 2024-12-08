"use server";

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@lib/mongodb";
import { authConfig } from "./auth.config";
import { z } from "zod";
import { Customer } from "./app/lib/definition";

export async function getUser(email: string) {
  try {
    const db = await connectToDatabase();
    const user = await db.collection<Customer>("customers").findOne({ email });

    return user;
  } catch (e) {
    console.error("Failed to fetch user:", e);
    throw new Error("Failed to fetch user.");
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(8) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) {
            throw new Error("Invalid credentials.");
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (!passwordsMatch) throw new Error("Invalid credentials.");
          if (!user.isVerified) throw new Error("Account not verified.");

          return user;
        }

        console.error("Authorization failed");
        return null;
      },
    }),
  ],
});
