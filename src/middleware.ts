import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ---- AUTH PROTECTION ----
  const protectedPaths = [
    /^\/shipping-address/,
    /^\/payment-method/,
    /^\/place-order/,
    /^\/profile/,
    /^\/user(\/.*)?$/,
    /^\/order(\/.*)?$/,
    /^\/admin(\/.*)?$/,
  ];

  const isProtected = protectedPaths.some((p) => p.test(pathname));

  if (isProtected) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      cookieName: process.env.NODE_ENV === "production"
        ? "__Secure-authjs.session-token"
        : "authjs.session-token",
    });

    if (!token) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  // ---- GUEST CART SESSION ----
  const sessionCartId = req.cookies.get("sessionCartId")?.value;

  if (!sessionCartId) {
    const newSessionId = crypto.randomUUID();
    const response = NextResponse.next();
    response.cookies.set("sessionCartId", newSessionId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};