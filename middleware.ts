"use server";

import { NextResponse, NextRequest } from "next/server";
import { authRoutes, DEFAULT_SIGNIN_REDIRECT, protectedRoutes } from "@/routes";
import verifyToken from "@lib/auth";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  const { nextUrl } = req;

  let isLoggedIn = null;

  if (token) {
    const result = await verifyToken(token);
    if (result.isValid) {
      isLoggedIn = result.payload;
    }
  }

  const path = nextUrl.pathname;

  if (authRoutes.some((route) => path.startsWith(route)) && isLoggedIn) {
    return NextResponse.redirect(new URL(DEFAULT_SIGNIN_REDIRECT, nextUrl));
  }

  if (protectedRoutes.some((route) => path.startsWith(route)) && !isLoggedIn) {
    const redirectUrl = new URL("/user/signin", nextUrl);
    redirectUrl.searchParams.set("callback", path);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/user/account/:path*", "/user/purchase/:path*", "/user/signin"],
};
