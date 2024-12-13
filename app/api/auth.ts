"use server";

import { jwtVerify } from "jose";

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
