import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/auth/me`,
      {
        headers: {
          cookie: req.headers.get("cookie") || "",
        },
        credentials: "include",
      },
    );

    if (res.status === 401 && pathname !== "/auth") {
      return NextResponse.redirect(new URL("/auth", req.url));
    }

    if (res.status === 200 && pathname === "/auth") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  } catch (error) {
    console.error("Middleware Auth Check Failed:", error);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
