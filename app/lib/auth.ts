"use server";

import { jwtVerify } from "jose";

export default async function verifyToken(token: string) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

  try {
    const { payload } = await jwtVerify(token, secret, {
      issuer: "https://hat-nnva.vercel.app",
      audience: "https://hat-nnva.vercel.app/api",
    });
    return { isValid: true, payload };
  } catch (error) {
    return { isValid: false, error };
  }
}
