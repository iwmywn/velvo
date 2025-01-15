"use server";

import { NextResponse, type NextRequest } from "next/server";
import { authRoutes, DEFAULT_SIGNIN_REDIRECT, protectedRoutes } from "@/routes";
import { siteConfig } from "@lib/config";
import { updateSession } from "@lib/session";
import { verifySession } from "@lib/dal";

export async function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req;
  const path = nextUrl.pathname;

  if (siteConfig.maintenanceMode && path !== "/") {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  const redirectToSignIn = () => {
    const redirectUrl = new URL("/signin", nextUrl);
    redirectUrl.searchParams.set("next", path);
    return NextResponse.redirect(redirectUrl);
  };
  const session = cookies.get("session")?.value;
  const userIdStore = cookies.get("userId")?.value;
  const userImageStore = cookies.get("userImage")?.value;
  const { userId, userImage, expires } = await verifySession();

  if (!userId) {
    if (protectedRoutes.some((route) => path.startsWith(route))) {
      return redirectToSignIn();
    }

    const response = NextResponse.next();

    if (userIdStore) response.cookies.delete("userId");
    if (userImageStore) response.cookies.delete("userImage");

    return response;
  }

  if (authRoutes.some((route) => path.startsWith(route)) && userId) {
    return NextResponse.redirect(new URL(DEFAULT_SIGNIN_REDIRECT, nextUrl));
  }

  const expiresIn = new Date(expires).getTime() - Date.now();

  if (expiresIn < 24 * 60 * 60 * 1000 && session) {
    await updateSession(session);
  }

  if (!userIdStore || !userImageStore) {
    const response = NextResponse.next();

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
