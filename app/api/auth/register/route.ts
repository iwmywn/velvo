"use server";

import { connectToDatabase } from "@lib/mongodb";
import bcrypt from "bcrypt";
import { getUserByIdentifier, sendEmail } from "@lib/actions";
import { registerSchema } from "@/schemas";
import { generateUniqueToken } from "@api/utils";
import { createResponse } from "@lib/utils";
import { avatars, baseImgUrl } from "@ui/data";
import verifyRecaptchaToken from "@lib/recaptcha";

export async function POST(req: Request) {
  const data = await req.json();
  const { recaptchaToken, ...userData } = data;

  if (!recaptchaToken) return createResponse("Invalid field!", 400);

  const verify = await verifyRecaptchaToken(recaptchaToken);

  if (!verify) return createResponse("Captcha challenge failed!", 422);

  const parsedCredentials = registerSchema.safeParse(userData);

  if (!parsedCredentials.success) return createResponse("Invalid field!", 400);

  const { firstName, lastName, email, password } = parsedCredentials.data;
  const existingUser = await getUserByIdentifier(email);

  if (existingUser) return createResponse("Email already registered!", 400);

  const [db, hashedPassword] = await Promise.all([
    connectToDatabase(),
    bcrypt.hash(password, 10),
  ]);
  const verificationToken = await generateUniqueToken(db);
  const avatar = avatars[Math.floor(Math.random() * 20)];

  const result = await db.collection("users").insertOne({
    name: `${firstName} ${lastName}`,
    email,
    password: hashedPassword,
    isVerified: false,
    image: `${baseImgUrl}${avatar}`,
    verificationToken,
    resendVerification: 1,
    createdAt: new Date(),
  });

  if (!result.acknowledged)
    return createResponse("Account creation failed! Try again later.", 500);

  // await sendEmail(email, verificationToken, "verifyEmail");

  return createResponse("Verification email sent.", 201);
}
