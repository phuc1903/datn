"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = useParams();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState({ email: "", password: "", password_confirmation: "" });
  const [loading, setLoading] = useState(false);

  const validatePassword = (password: string) => password.length >= 8;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { email, password, password_confirmation } = formData;

    const newErrors = {
      email: email ? "" : "Email không được để trống",
      password: validatePassword(password) ? "" : "Mật khẩu phải có ít nhất 8 ký tự",
      password_confirmation: password === password_confirmation ? "" : "Mật khẩu xác nhận không khớp",
    };

    if (newErrors.email || newErrors.password || newErrors.password_confirmation) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          password_confirmation,
          token,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Đặt lại mật khẩu thất bại.");
      }

      alert("Mật khẩu đã được đặt lại thành công! Vui lòng đăng nhập.");
      router.push("/login");
    } catch (error) {
      console.error("Lỗi đặt lại mật khẩu:", error);
      alert("Lỗi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white text-black">
      <div className="w-full max-w-md px-6 py-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Đặt lại mật khẩu
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent"
              placeholder="Nhập email của bạn"
              required
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu mới
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent"
              placeholder="Nhập mật khẩu mới"
              required
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Xác nhận mật khẩu mới
            </label>
            <input
              type="password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent"
              placeholder="Nhập lại mật khẩu mới"
              required
            />
            {errors.password_confirmation && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password_confirmation}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 text-white bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Đang xử lý...
              </div>
            ) : (
              "Đặt lại mật khẩu"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}