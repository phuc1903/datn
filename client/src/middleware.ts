import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;

  const guestRoutes = ["/login", "/register", "/forgot-password"];
  const protectedRoutes = ["/profile", "/change-password", "/order"];

  // Nếu chưa đăng nhập
  if (!token) {
    // Chặn truy cập vào các trang yêu cầu đăng nhập (profile, change-password, order)
    if (protectedRoutes.includes(req.nextUrl.pathname) || 
        req.nextUrl.pathname.startsWith("/reset-password") || 
        req.nextUrl.pathname.startsWith("/order/")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  } else {
    // Nếu đã đăng nhập, chỉ chặn truy cập vào login, register, forgot-password, reset-password
    if (guestRoutes.includes(req.nextUrl.pathname) || req.nextUrl.pathname.startsWith("/reset-password")) {
      return NextResponse.redirect(new URL("/profile", req.url));
    }
  }

  return NextResponse.next();
}

// Áp dụng middleware cho tất cả các trang cần kiểm soát
export const config = {
  matcher: ["/login", "/register", "/forgot-password", "/profile", "/change-password", "/order", "/order/:path*"],
};
