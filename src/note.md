/* import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export function middleware(req: NextRequest) {
  //Array of regex patterns of paths we want to protect
 /*  const protectedPaths = [
    /\/shipping-address/,
    /\/payment-method/,
    /\/place-order/,
    /\/profile/,
    /\/user\/(.*)/,
    /\/order\/(.*)/,
    /\/admin/,
  ]
  //get pathname from the request url object
  const {pathname} = req.nextUrl;
  
  //check if user is not authenticated and accessing a protected route or path
  if(!auth && protectedPaths.some((p)=> p.test(pathname))) return false
  
*/

  const sessionCartId = req.cookies.get("sessionCartId")?.value;
  // If no session cookie, create one
  if (!sessionCartId) {
    const newSessionId = crypto.randomUUID();
    console.log("New cart session:", newSessionId);

    const response = NextResponse.next();

    response.cookies.set("sessionCartId", newSessionId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  }

  // Already has session
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|shipping-address|$).*)"],
};
 */