"use server";

import verifyToken from "@lib/auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;

  if (!token) {
    return new Response(JSON.stringify({ isLoggedIn: false }), { status: 200 });
  }

  const result = await verifyToken(token);

  if (result.isValid && result.payload?.id) {
    return new Response(
      JSON.stringify({ isLoggedIn: true, id: result.payload.id }),
      { status: 200 },
    );
  }

  return new Response(JSON.stringify({ isLoggedIn: false }), { status: 401 });
}
