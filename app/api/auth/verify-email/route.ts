"use server";

import { connectToDatabase } from "@lib/mongodb";
import { createResponse } from "@lib/utils";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  // if (!token) return createResponse("Invalid token!", 400);

  const db = await connectToDatabase();
  const user = await db
    .collection("users")
    .findOne({ verificationToken: token });

  if (!user)
    return createResponse("Token expired or email already verified!", 404);

  await db.collection("users").updateOne(
    { verificationToken: token },
    {
      $set: { isVerified: true },
      $unset: { verificationToken: "", resendVerification: "" },
    },
  );

  return createResponse("Email verified successfully.", 200);
}
