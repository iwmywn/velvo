"use server";

import { SignJWT } from "jose";
import { getUserByIdentifier } from "@lib/data";
import bcrypt from "bcrypt";
import { signInSchema } from "@/schemas";
import cookie from "cookie";
import { createResponse } from "@lib/utils";

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

  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
  const token = await new SignJWT({ id: existingUser._id })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("https://hat-nnva.vercel.app")
    .setAudience("https://hat-nnva.vercel.app/api")
    .setExpirationTime("1h")
    .sign(secret);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60,
    path: "/",
    sameSite: "strict" as const,
  };

  const cookieHeader = cookie.serialize("auth_token", token, cookieOptions);

  return new Response(JSON.stringify({ message: "Signin successful." }), {
    status: 200,
    headers: {
      "Set-Cookie": cookieHeader,
      Location: "/",
    },
  });
}
