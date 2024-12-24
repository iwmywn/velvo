"use server";

import { NextResponse, NextRequest } from "next/server";
import { authRoutes, DEFAULT_SIGNIN_REDIRECT, protectedRoutes } from "@/routes";
import verifyJWTToken from "@api/auth";
import { siteConfig } from "@lib/config";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  const { nextUrl } = req;
  const path = nextUrl.pathname;
  let isSignedIn = null;

  if (siteConfig.maintenanceMode && path !== "/")
    return NextResponse.redirect(new URL("/", nextUrl));

  if (token) {
    const result = await verifyJWTToken(token);
    isSignedIn = result.isValid;
  }

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
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
