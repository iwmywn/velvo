"use server";

import { connectToDatabase } from "@lib/mongodb";
import { sendEmail } from "@lib/actions";
import { nanoid } from "nanoid";
import { getUserByIdentifier } from "@lib/data";
import { emailScheme } from "@/schemas";

export async function POST(req: Request) {
  const data = await req.json();
  const parsedCredentials = emailScheme.safeParse(data);

  if (!parsedCredentials.success) {
    return new Response(JSON.stringify({ message: "Invalid field!" }), {
      status: 400,
    });
  }
  const { email } = parsedCredentials.data;
  const existingUser = await getUserByIdentifier(email);

  if (!existingUser) {
    return new Response(
      JSON.stringify({
        message:
          "If this email exists and has not been verified, we will send a new verification email.",
      }),
      {
        status: 200,
      },
    );
  }

  if (existingUser.isVerified) {
    return new Response(
      JSON.stringify({ message: "Email already verified!" }),
      {
        status: 400,
      },
    );
  }

  if (existingUser.resendVerification >= 2) {
    return new Response(
      JSON.stringify({
        message: "You have reached the maximum number of resend attempts!",
      }),
      {
        status: 429,
      },
    );
  }

  const verificationToken = nanoid();
  const db = await connectToDatabase();

  await db.collection("users").updateOne(
    { email: email },
    {
      $set: { verificationToken: verificationToken },
      $inc: { resendVerification: 1 },
    },
  );

  await sendEmail(email, verificationToken, "reset");

  return new Response(
    JSON.stringify({
      message:
        "If this email exists and has not been verified, we will send a new verification email.",
    }),
    {
      status: 201,
    },
  );
}
