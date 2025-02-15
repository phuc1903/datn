"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Cookies from "js-cookie";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 8;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    const newErrors = {
      email: validateEmail(email) ? "" : "Email không hợp lệ",
      password: validatePassword(password) ? "" : "Mật khẩu phải có ít nhất 8 ký tự",
    };

    if (newErrors.email || newErrors.password) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Đăng nhập thất bại");
      }

      const result = await response.json();
      console.log("Login response:", result);
      alert("Đăng nhập thành công !");

      if (result.status === "success") {
        // Lưu token vào cookies thay vì sessionStorage
        Cookies.set("accessToken", result.data.token, { expires: 1 }); // Lưu token (hết hạn sau 1 ngày)
        Cookies.set("userEmail", email, { expires: 1 });

        router.push("/profile"); // Chuyển hướng sau khi login
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.");
    }
  };

  
const handleGoogleLogin = () => {
  console.log("Google login clicked");
};
  return (
    
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <div className="flex justify-center mb-8">
          <div>
            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Đăng nhập</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 text-black focus:ring-pink-500 focus:border-transparent transition-all`}
              placeholder="example@email.com"
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 text-black focus:ring-pink-500 focus:border-transparent transition-all`}
                placeholder="Nhập mật khẩu"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-600 hover:text-pink-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-pink-600 rounded border-gray-300 focus:ring-pink-500"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Ghi nhớ đăng nhập
              </label>
            </div>

            <div className="text-sm">
              <a href="/forgot-password" className="text-pink-600 hover:text-blue-700 font-medium">
                Quên mật khẩu?
              </a>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 text-white bg-pink-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Đăng nhập
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Hoặc đăng nhập với</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <img src="/gg.svg" alt="Google logo" className="h-5 w-5 mr-2" />
            Tiếp tục với Google
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600">
          Chưa có tài khoản?{" "}
          <a href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
            Đăng ký ngay
          </a>
        </p>
      </div>
    </div>
  );
}