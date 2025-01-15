"use server";

import bcrypt from "bcrypt";
import { sendEmail } from "@lib/actions";
import { registerSchema } from "@/schemas";
import { createResponse } from "@api/utils";
import verifyRecaptchaToken from "@lib/recaptcha";
import { getUserCollection } from "@lib/collections";
import { getAvatars, getUserByEmail } from "@lib/data";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  const data = await req.json();
  const { recaptchaToken, ...userData } = data;

  if (!recaptchaToken) return createResponse("Invalid field!", 400);

  const verify = await verifyRecaptchaToken(recaptchaToken);

  if (!verify) return createResponse("Captcha challenge failed!", 422);

  const parsedCredentials = registerSchema.safeParse(userData);

  if (!parsedCredentials.success) return createResponse("Invalid field!", 400);

  const { firstName, lastName, email, password } = parsedCredentials.data;
  const existingUser = await getUserByEmail(email);

  if (existingUser) return createResponse("Email already registered!", 400);

  const [hashedPassword, avatars] = await Promise.all([
    bcrypt.hash(password, 10),
    getAvatars(),
  ]);
  const verificationToken = nanoid();
  const avatar = avatars[Math.floor(Math.random() * 20)].image;

  const result = await (
    await getUserCollection()
  ).insertOne({
    name: `${firstName} ${lastName}`,
    email,
    password: hashedPassword,
    emailVerified: false,
    image: `${avatar}`,
    verificationToken,
    resendVerification: 1,
    createdAt: new Date(),
  });

  if (!result.acknowledged)
    return createResponse("Account creation failed! Try again later.", 500);

  await sendEmail(email, verificationToken, "verifyEmail");

  return createResponse("Verification email sent.", 201);
}
