"use server";

import { NextResponse, NextRequest } from "next/server";
import { authRoutes, DEFAULT_SIGNIN_REDIRECT, protectedRoutes } from "@/routes";
import { siteConfig } from "@lib/config";
import { verifySession } from "@lib/dal";

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const path = nextUrl.pathname;

  if (siteConfig.maintenanceMode && path !== "/")
    return NextResponse.redirect(new URL("/", nextUrl));

  const { userId, image } = await verifySession();

  if (authRoutes.some((route) => path.startsWith(route)) && userId) {
    return NextResponse.redirect(new URL(DEFAULT_SIGNIN_REDIRECT, nextUrl));
  }

  if (protectedRoutes.some((route) => path.startsWith(route)) && !userId) {
    const redirectUrl = new URL("/signin", nextUrl);
    redirectUrl.searchParams.set("next", path);
    return NextResponse.redirect(redirectUrl);
  }

  const response = NextResponse.next();
  if (userId && image) {
    response.cookies.set("userId", userId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
    response.cookies.set("userImage", image, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
  } else {
    response.cookies.delete("userId");
    response.cookies.delete("userImage");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
