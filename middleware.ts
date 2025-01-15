"use server";

import { NextResponse, type NextRequest } from "next/server";
import { authRoutes, DEFAULT_SIGNIN_REDIRECT, protectedRoutes } from "@/routes";
import { siteConfig } from "@lib/config";
import { decrypt, updateSession } from "@lib/session";

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const path = nextUrl.pathname;

  if (siteConfig.maintenanceMode && path !== "/") {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  const redirectToSignIn = () => {
    const redirectUrl = new URL("/signin", nextUrl);
    redirectUrl.searchParams.set("next", path);
    return NextResponse.redirect(redirectUrl);
  };
  const session = req.cookies.get("session")?.value;
  const payload = session ? await decrypt(session) : null;

  if (!payload) {
    if (protectedRoutes.some((route) => path.startsWith(route))) {
      return redirectToSignIn();
    }

    return NextResponse.next();
  }

  if (authRoutes.some((route) => path.startsWith(route)) && payload) {
    return NextResponse.redirect(new URL(DEFAULT_SIGNIN_REDIRECT, nextUrl));
  }

  const expiresIn = new Date(payload.expires).getTime() - Date.now();

  if (expiresIn < 24 * 60 * 60 * 1000 && session) {
    await updateSession(session);
  }

  const userId = req.cookies.get("userId")?.value;
  const userImage = req.cookies.get("userImage")?.value;

  if (!userId || !userImage) {
    const response = NextResponse.next();
    const { userId, userImage } = payload.user;

    response.cookies.set("userId", userId || "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    response.cookies.set("userImage", userImage || "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
