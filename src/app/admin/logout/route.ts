import { NextResponse, type NextRequest } from "next/server";

const ADMIN_SESSION_KEY = "chain-radar-admin-session";

export function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/admin/login", request.url));
  response.cookies.set(ADMIN_SESSION_KEY, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 0
  });
  return response;
}
