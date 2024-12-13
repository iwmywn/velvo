"use server";

import { connectToDatabase } from "@lib/mongodb";
import bcrypt from "bcrypt";
import { getUserByIdentifier, sendEmail } from "@lib/actions";
import { registerSchema } from "@/schemas";
import { generateUniqueToken } from "@api/utils";
import { createResponse } from "@lib/utils";

export async function POST(req: Request) {
  const data = await req.json();
  const parsedCredentials = registerSchema.safeParse(data);

  if (!parsedCredentials.success) return createResponse("Invalid field!", 400);

  const { firstName, lastName, email, password } = parsedCredentials.data;
  const existingUser = await getUserByIdentifier(email);

  if (existingUser) return createResponse("Email already registered!", 400);

  const hashedPassword = await bcrypt.hash(password, 10);
  const db = await connectToDatabase();
  const verificationToken = await generateUniqueToken(db);

  const result = await db.collection("users").insertOne({
    name: `${firstName} ${lastName}`,
    email,
    password: hashedPassword,
    isVerified: false,
    verificationToken,
    resendVerification: 1,
  });

  if (!result.acknowledged)
    return createResponse("Account creation failed! Try again later.", 500);

  // await sendEmail(email, verificationToken, "verifyEmail");

  return createResponse("Verification email sent.", 201);
}
