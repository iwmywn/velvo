"use server";

import { getUserByIdentifier } from "@lib/actions";
import bcrypt from "bcrypt";
import { signInSchema } from "@/schemas";
import { createResponse } from "@lib/utils";
import { createSession } from "@lib/session";

export async function POST(req: Request) {
  const data = await req.json();
  const parsedCredentials = signInSchema.safeParse(data);

  if (!parsedCredentials.success) return createResponse("Invalid field!", 400);

  const { email, password } = parsedCredentials.data;
  const existingUser = await getUserByIdentifier(email);

  if (!existingUser)
    return createResponse("Email or password is incorrect!", 400);

  const isPasswordValid = await bcrypt.compare(password, existingUser.password);

  if (!isPasswordValid)
    return createResponse("Email or password is incorrect!", 400);

  if (!existingUser.isVerified)
    return createResponse(
      "Account not verified. Please check your email to verify!",
      400,
    );

  await createSession(existingUser._id.toString(), existingUser.image);

  return new Response(JSON.stringify({ message: "Signin successful." }), {
    status: 200,
  });
}
