"use server";

import { getUserByIdentifier, sendEmail } from "@lib/actions";
import { emailScheme } from "@/schemas";
import { generateUniqueToken } from "@api/utils";
import { createResponse } from "@lib/utils";
import verifyRecaptchaToken from "@lib/recaptcha";
import { getUserCollection } from "@lib/collections";

export async function PATCH(req: Request) {
  const data = await req.json();
  const { recaptchaToken, ...userData } = data;

  if (!recaptchaToken) return createResponse("Invalid field!", 400);

  const verify = await verifyRecaptchaToken(recaptchaToken);

  if (!verify) return createResponse("Captcha challenge failed!", 422);

  const parsedCredentials = emailScheme.safeParse(userData);

  if (!parsedCredentials.success) return createResponse("Invalid field!", 400);

  const { email } = parsedCredentials.data;
  const existingUser = await getUserByIdentifier(email);

  if (!existingUser)
    return createResponse(
      "If this email is valid and has not been verified, we will send a new verification email.",
      200,
    );

  if (existingUser.isVerified)
    return createResponse("Email already verified!", 400);

  if (existingUser.resendVerification >= 2)
    return createResponse(
      "You have reached the maximum number of resend attempts!",
      429,
    );

  const verificationToken = await generateUniqueToken();

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

  await sendEmail(email, verificationToken, "verifyEmail");

  return createResponse(
    "If this email is valid and has not been verified, we will send a new verification email.",
    201,
  );
}
