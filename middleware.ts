import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = ["/settings", "/quiz"];
const guestOnlyRoutes = ["/login", "/signup"];

const matches = (pathname: string, routes: string[]) =>
  routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET?.trim(),
  });
  const isSignedIn = typeof token?.id === "string";
  const { pathname } = req.nextUrl;

  if (!isSignedIn && matches(pathname, protectedRoutes)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isSignedIn && matches(pathname, guestOnlyRoutes)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/settings/:path*", "/quiz/:path*", "/login", "/signup"],
};
