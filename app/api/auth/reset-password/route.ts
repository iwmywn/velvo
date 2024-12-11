"use server";

import { connectToDatabase } from "@lib/mongodb";
import { passwordScheme } from "@/schemas";
import { createResponse } from "@lib/utils";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const data = await req.json();
  const parsedCredentials = passwordScheme.safeParse(data);

  if (!parsedCredentials.success) return createResponse("Invalid field!", 400);

  const { password } = parsedCredentials.data;

  const db = await connectToDatabase();
  const hashedPassword = bcrypt.hash(password, 10);

  await db.collection("users").updateOne(
    { verificationToken: token },
    {
      $set: { password: hashedPassword },
      $unset: { verificationToken: "", resendVerification: "" },
    },
  );

  return createResponse("Your password has been changed.", 201);
}
