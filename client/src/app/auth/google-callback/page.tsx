"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { API_BASE_URL } from "@/config/config";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

function GoogleCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const status = searchParams.get("status");
      const token = searchParams.get("token");
      const email = searchParams.get("email");
      const message = searchParams.get("message");

      if (status === "error" || !token) {
        Swal.fire({
          title: "Lỗi!",
          text: message || "Đăng nhập bằng Google thất bại",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#db2777",
        }).then(() => {
          router.push("/login");
        });
        return;
      }

      if (status === "success" && token) {
        // Lưu token vào cookies
        Cookies.set("accessToken", token);
        
        // Nếu có email, có thể lưu thêm
        if (email) {
          Cookies.set("userEmail", email);
        }

        Swal.fire({
          title: "Thành công!",
          text: "Đăng nhập thành công",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#db2777",
        }).then(() => {
          router.push("/");
        });
      } else {
        Swal.fire({
          title: "Lỗi!",
          text: "Dữ liệu đăng nhập không hợp lệ",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#db2777",
        }).then(() => {
          router.push("/login");
        });
      }
    };

    handleGoogleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    }>
      <GoogleCallbackContent />
    </Suspense>
  );
}