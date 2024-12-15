"use server";

import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export default async function verifyToken(token: string) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

  try {
    const { payload } = await jwtVerify(token, secret, {
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE,
    });
    return { isValid: true, payload };
  } catch (error) {
    console.error("JWT verification error:", error);
    return { isValid: false, error };
  }
}

export async function getUserId(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (token) {
    const result = await verifyToken(token);
    if (result.isValid && typeof result.payload?.id === "string") {
      return result.payload.id;
    }
  }
  return undefined;
}
