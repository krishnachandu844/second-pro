import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;
  console.log(pathname);
  if (!token && pathname !== "/signin") {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
  if (token && pathname === "/signin") {
    return NextResponse.redirect(new URL("/chat", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/signin", "/signup", "/chat"],
};
