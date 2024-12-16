"use server";

import { connectToDatabase } from "@lib/mongodb";
import { getUserByIdentifier, sendEmail } from "@lib/actions";
import { emailScheme } from "@/schemas";
import { createResponse } from "@lib/utils";
import { generateUniqueToken } from "@api/utils";

export async function PATCH(req: Request) {
  const data = await req.json();
  const parsedCredentials = emailScheme.safeParse(data);

  if (!parsedCredentials.success) return createResponse("Invalid field!", 400);

  const { email } = parsedCredentials.data;
  const existingUser = await getUserByIdentifier(email);

  if (!existingUser)
    return createResponse(
      "If this email is valid, we will send a new password reset email.",
      200,
    );

  if (existingUser.resendVerification >= 2)
    return createResponse(
      "You have reached the maximum number of resend attempts!",
      429,
    );

  const db = await connectToDatabase();
  const verificationToken = await generateUniqueToken(db);

  const result = await db.collection("users").updateOne(
    { email: email },
    {
      $set: { verificationToken: verificationToken },
      $inc: { resendVerification: 1 },
    },
  );

  if (result.modifiedCount === 0)
    return createResponse("Request failed! Try again later.", 500);

  await sendEmail(email, verificationToken, "resetPassword");

  return createResponse(
    "If this email is valid, we will send a new password reset email.",
    201,
  );
}
