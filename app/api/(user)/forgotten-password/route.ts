"use server";

import { sendEmail } from "@lib/email";
import { emailScheme } from "@/schemas";
import { createResponse } from "@api/utils";
import verifyRecaptchaToken from "@lib/recaptcha";
import { getUserCollection } from "@lib/collections";
import { getUserByEmail } from "@lib/data";
import { nanoid } from "nanoid";

export async function PATCH(req: Request) {
  const data = await req.json();
  const { recaptchaToken, ...userData } = data;

  const verify = await verifyRecaptchaToken(recaptchaToken);

  if (!verify) return createResponse("Captcha challenge failed!", 422);

  const parsedCredentials = emailScheme.safeParse(userData);

  if (!parsedCredentials.success) return createResponse("Invalid field!", 400);

  const { email } = parsedCredentials.data;
  const existingUser = await getUserByEmail(email);

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

  const verificationToken = nanoid();

  const result = await (
    await getUserCollection()
  ).updateOne(
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
