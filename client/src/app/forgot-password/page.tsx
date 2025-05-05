"use client";
// Đánh dấu component này là Client Component để sử dụng hooks và state

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // Thư viện quản lý cookies
import { toast } from "react-hot-toast"; // Thư viện hiển thị thông báo toast
import { API_BASE_URL } from "@/config/config";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState(""); // State lưu trữ email người dùng nhập
  const [loading, setLoading] = useState(false); // State quản lý trạng thái loading
  const [message, setMessage] = useState(""); // State lưu trữ thông báo phản hồi từ server
  const [cooldown, setCooldown] = useState(0); // State đếm ngược thời gian chờ giữa các lần gửi yêu cầu

  // Effect quản lý đếm ngược cooldown
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (cooldown > 0) {
      // Tạo một interval để giảm cooldown mỗi giây
      timer = setInterval(() => {
        setCooldown(prev => prev - 1);
      }, 1000);
    }
    // Cleanup function để xóa timer khi component unmount hoặc cooldown = 0
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [cooldown]);

  // Kiểm tra nếu người dùng đã đăng nhập, chuyển hướng về trang profile
  if (typeof window !== "undefined" && Cookies.get("accessToken")) {
    router.push("/profile");
    return null;
  }

  // Xử lý submit form quên mật khẩu
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Gọi API quên mật khẩu
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === "success") {
          // Hiển thị thông báo thành công
          toast.success("Mã xác thực đã được gửi đến email của bạn!");
          // Thiết lập cooldown 60 giây cho lần gửi tiếp theo
          setCooldown(60);
        } else {
          // Hiển thị thông báo lỗi từ server
          toast.error(data.message || "Có lỗi xảy ra khi gửi mã xác thực.");
        }
      } else {
        // Hiển thị thông báo lỗi khi response không ok
        toast.error("Có lỗi xảy ra khi gửi mã xác thực.");
      }
    } catch (error) {
      // Xử lý các lỗi khác
      console.error("Lỗi đặt lại mật khẩu:", error);
      if (error instanceof Error) {
        toast.error("Lỗi: " + error.message);
      } else {
        toast.error("Đã xảy ra lỗi không xác định");
      }
    } finally {
      // Kết thúc trạng thái loading
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r  bg-white">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 border border-pink-100">
        {/* Header với tiêu đề và mô tả */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-pink-600">Quên Mật Khẩu?</h2>
          <p className="text-gray-500 mt-2 text-sm">
            Đừng lo lắng! Chúng tôi sẽ gửi hướng dẫn đến email của bạn
          </p>
        </div>
        
        {/* Form nhập email */}
        <form onSubmit={handleSubmit} className="space-y-6 text-black">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Email của bạn
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all outline-none"
              placeholder="example@email.com"
              required
            />
          </div>
          
          {/* Nút gửi yêu cầu - disabled khi đang loading hoặc trong thời gian cooldown */}
          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-3 rounded-lg font-medium hover:bg-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || cooldown > 0}
          >
            {loading ? (
              <span>Đang xử lý...</span>
            ) : cooldown > 0 ? (
              <span>Vui lòng đợi {cooldown}s</span>
            ) : (
              <span>Gửi yêu cầu</span>
            )}
          </button>
        </form>

        {/* Hiển thị thông báo phản hồi nếu có */}
        {message && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600 text-sm text-center">{message}</p>
          </div>
        )}

        {/* Link quay lại trang đăng nhập */}
        <div className="mt-6 text-center">
          <a href="/login" className="text-pink-600 hover:text-pink-700 text-sm font-medium">
            Quay lại đăng nhập
          </a>
        </div>
      </div>
    </div>
  );
}