import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value; // Lấy token từ cookies

  // Nếu user đã login, chặn truy cập login & register
  if (token && ["/login", "/register"].includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  return NextResponse.next();
}

// Chỉ áp dụng middleware cho login & register
export const config = {
  matcher: ["/login", "/register"],
};
