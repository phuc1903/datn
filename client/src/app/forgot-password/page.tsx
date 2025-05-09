"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { API_BASE_URL } from "@/config/config";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [cooldown]);

  // Nếu user đã đăng nhập, chuyển hướng về profile
  if (typeof window !== "undefined" && Cookies.get("accessToken")) {
    router.push("/profile");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
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
          toast.success("Mã xác thực đã được gửi đến email của bạn!");
          setCooldown(60);
        } else {
          toast.error(data.message || "Có lỗi xảy ra khi gửi mã xác thực.");
        }
      } else {
        toast.error("Có lỗi xảy ra khi gửi mã xác thực.");
      }
    } catch (error) {
      console.error("Lỗi đặt lại mật khẩu:", error);
      if (error instanceof Error) {
        toast.error("Lỗi: " + error.message);
      } else {
        toast.error("Đã xảy ra lỗi không xác định");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r  bg-white">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 border border-pink-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-pink-600">Quên Mật Khẩu?</h2>
          <p className="text-gray-500 mt-2 text-sm">
            Đừng lo lắng! Chúng tôi sẽ gửi hướng dẫn đến email của bạn
          </p>
        </div>
        
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

        {message && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600 text-sm text-center">{message}</p>
          </div>
        )}

        <div className="mt-6 text-center">
          <a href="/login" className="text-pink-600 hover:text-pink-700 text-sm font-medium">
            Quay lại đăng nhập
          </a>
        </div>
      </div>
    </div>
  );
}