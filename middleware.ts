"use server";

import { jwtVerify } from "jose";
import { NextResponse, NextRequest } from "next/server";
import { authRoutes, DEFAULT_SIGNIN_REDIRECT, protectedRoutes } from "@/routes";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  const { nextUrl } = req;

  let isLoggedIn = null;

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

      const { payload } = await jwtVerify(token, secret, {
        issuer: "https://hat-nnva.vercel.app/",
        audience: "https://hat-nnva.vercel.app/api",
      });

      isLoggedIn = payload;
    } catch (error) {
      console.error("Token verification failed", error);
    }
  }

  const path = nextUrl.pathname;

  if (path.startsWith(authRoutes) && isLoggedIn) {
    return NextResponse.redirect(new URL(DEFAULT_SIGNIN_REDIRECT, nextUrl));
  }

  if (protectedRoutes.some((route) => path.startsWith(route)) && !isLoggedIn) {
    const redirectUrl = new URL(authRoutes, nextUrl);
    redirectUrl.searchParams.set("callback", path);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/user/account/:path*", "/user/purchase/:path*", "/user/signin"],
};
