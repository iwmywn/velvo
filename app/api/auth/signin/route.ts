"use server";

import bcrypt from "bcrypt";
import { signInSchema } from "@/schemas";
import { createResponse } from "@api/utils";
import { createSession } from "@lib/session";
import { getUserByEmail } from "@lib/data";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const data = await req.json();
  const parsedCredentials = signInSchema.safeParse(data);

  if (!parsedCredentials.success) return createResponse("Invalid field!", 400);

  const { email, password } = parsedCredentials.data;
  const existingUser = await getUserByEmail(email);

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

  const { _id, image } = existingUser;
  const [, cookieStore] = await Promise.all([
    createSession(_id.toString(), image),
    cookies(),
  ]);

  cookieStore.set("userId", _id.toString(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });
  cookieStore.set("userImage", image, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });

  return new Response(JSON.stringify({ message: "Signin successful." }), {
    status: 200,
  });
}
