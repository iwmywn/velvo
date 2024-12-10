import jwt from "jsonwebtoken";
import { NextResponse, NextRequest } from "next/server";
import cookie from "cookie";

interface JwtPayload {
  id: string;
}

declare module "next/server" {
  interface NextRequest {
    user?: JwtPayload;
  }
}

export const middleware = (req: NextRequest & { user?: JwtPayload }) => {
  const cookies = cookie.parse(req.headers.get("Cookie") || "");
  const token = cookies.auth_token;

  if (!token) {
    if (
      req.nextUrl.pathname.startsWith("/user/account") ||
      req.nextUrl.pathname.startsWith("/user/purchase")
    ) {
      return NextResponse.redirect(new URL("/user/signin", req.nextUrl));
    }
    return NextResponse.next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded;

    if (req.nextUrl.pathname.startsWith("/user/signin")) {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    return NextResponse.next();
  } catch (error) {
    if (
      req.nextUrl.pathname.startsWith("/user/account") ||
      req.nextUrl.pathname.startsWith("/user/purchase")
    ) {
      return NextResponse.redirect(new URL("/user/signin", req.nextUrl));
    }
  }
};

export const config = {
  matcher: ["/user/account/:path*", "/user/purchase/:path*", "/user/signin/"],
};

/**
 * khi nguoi dung truy cap trang
 * neu nguoi dung dang o trang /user/account hoac /user/purchase -> kiem tra neu token hop le -> true
 * nguoc lai -> false
 * neu nguoi dung dang o trang /user/signin -> kiem tra neu token hop le -> redirect /
 * nguoc lai -> false
 *
 */
