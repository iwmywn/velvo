"use server";

import { NextResponse, NextRequest } from "next/server";
import { authRoutes, DEFAULT_SIGNIN_REDIRECT, protectedRoutes } from "@/routes";
import verifyToken from "@api/auth";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  const { nextUrl } = req;

  let isSignedIn = null;

  if (token) {
    const result = await verifyToken(token);
    isSignedIn = result.isValid;
  }

  const path = nextUrl.pathname;

  if (authRoutes.some((route) => path.startsWith(route)) && isSignedIn) {
    return NextResponse.redirect(new URL(DEFAULT_SIGNIN_REDIRECT, nextUrl));
  }

  if (protectedRoutes.some((route) => path.startsWith(route)) && !isSignedIn) {
    const redirectUrl = new URL("/user/signin", nextUrl);
    redirectUrl.searchParams.set("next", path);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/user/:path*", "/email-handle/:path*"],
};
