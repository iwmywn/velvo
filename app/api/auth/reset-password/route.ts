"use server";

import { connectToDatabase } from "@lib/mongodb";
import { resetPasswordScheme } from "@/schemas";
import { createResponse } from "@lib/utils";
import bcrypt from "bcrypt";

export async function PATCH(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const data = await req.json();
  const parsedCredentials = resetPasswordScheme.safeParse(data);

  if (!parsedCredentials.success) return createResponse("Invalid field!", 400);

  const { password } = parsedCredentials.data;

  const db = await connectToDatabase();
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await db.collection("users").updateOne(
    { verificationToken: token },
    {
      $set: { password: hashedPassword },
      $unset: { verificationToken: "", resendVerification: "" },
    },
  );

  if (result.matchedCount === 0) return createResponse("Token expired!", 404);

  if (result.modifiedCount === 0)
    return createResponse("Password update failed! Try again later.", 500);

  return createResponse("Your password has been changed.", 201);
}
