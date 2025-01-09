"use server";

import { NextResponse, NextRequest } from "next/server";
import { authRoutes, DEFAULT_SIGNIN_REDIRECT, protectedRoutes } from "@/routes";
import { siteConfig } from "@lib/config";
import { cookies } from "next/headers";
import { decrypt } from "@lib/session";

export async function middleware(req: NextRequest) {
  const cookie = (await cookies()).get("session")?.value;
  const { nextUrl } = req;
  const path = nextUrl.pathname;

  if (siteConfig.maintenanceMode && path !== "/")
    return NextResponse.redirect(new URL("/", nextUrl));

  const session = await decrypt(cookie);

  if (authRoutes.some((route) => path.startsWith(route)) && session?.userId) {
    return NextResponse.redirect(new URL(DEFAULT_SIGNIN_REDIRECT, nextUrl));
  }

  if (
    protectedRoutes.some((route) => path.startsWith(route)) &&
    !session?.userId
  ) {
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
