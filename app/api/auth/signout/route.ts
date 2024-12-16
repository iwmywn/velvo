"use server";

import { serialize } from "cookie";

export async function POST() {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
    sameSite: "strict" as const,
  };

  const cookieHeader = serialize("auth_token", "", cookieOptions);

  return new Response(null, {
    status: 303,
    headers: {
      "Set-Cookie": cookieHeader,
      Location: "/user/signin",
    },
  });
}
