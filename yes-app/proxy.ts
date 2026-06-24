import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  try {
    const path = req.nextUrl.pathname;
    const sessionId = req.cookies.get("session_id")?.value;

    if (!sessionId) return NextResponse.redirect(new URL("/", req.url));

    const result = await fetch(
      `${process.env.BACKEND_URL}/auth/validate-session`,
      {
        headers: { Cookie: `session_id=${sessionId}` },
        signal: AbortSignal.timeout(5000),
      },
    ).then((res) => (res.ok ? res.json() : null));

    if (!result?.success) return NextResponse.redirect(new URL("/", req.url));

    const role = result.data.role;

    if (path.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (path.startsWith("/staff") && role !== "STAFF") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (path.startsWith("/user") && role !== "CUSTOMER") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/error?type=auth-failed", req.url));
  }
}

export const config = {
  matcher: ["/admin-:path*", "/user-:path*", "/staff-:path*"],
};
