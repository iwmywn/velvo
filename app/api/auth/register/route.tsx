"use server";

import { connectToDatabase } from "@lib/mongodb";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "@lib/actions";
import { nanoid } from "nanoid";
import { getUserByEmail } from "@/app/lib/data";

export async function POST(req: Request) {
  const { firstName, lastName, email, password } = await req.json();
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return new Response(
      JSON.stringify({ message: "Email already registered" }),
      {
        status: 400,
      },
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();

  const db = await connectToDatabase();
  await db.collection("customers").insertOne({
    name: `${firstName} ${lastName}`,
    email,
    password: hashedPassword,
    isVerified: false,
    verificationToken,
  });

  await sendVerificationEmail(email, verificationToken);

  return new Response(
    JSON.stringify({
      message: "Registration successful! Check your email for verification.",
    }),
    {
      status: 201,
    },
  );
}
