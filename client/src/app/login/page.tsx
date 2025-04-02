"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Cookies from "js-cookie";
import Link from "next/link";
import Swal from "sweetalert2";
import Image from "next/image";
import { API_BASE_URL } from "@/config/config";

interface LoginForm {
  email: string;
  password: string;
}

interface LoginResponse {
  status: string;
  message: string;
  data: {
    token: string;
  };
}

interface GoogleLoginResponse {
  status: string;
  message: string;
  data: {
    url: string;
  };
}

interface FormErrors {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password: string): boolean => password.length >= 8;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result: LoginResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Đăng nhập thất bại");
      }

      if (result.status === "success") {
        await Swal.fire({
          title: "Thành công!",
          text: "Đăng nhập thành công!",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#db2777",
        });

        Cookies.set("accessToken", result.data.token, { expires: 1 });
        Cookies.set("userEmail", email, { expires: 1 });

        router.push("/profile");
      }
    } catch (error) {
      console.error("Login error:", error);
      await Swal.fire({
        title: "Lỗi!",
        text:
          error instanceof Error
            ? error.message
            : "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#db2777",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      console.log("Calling Google Login API at:", `${API_BASE_URL}/auth/login/google`);
      const response = await fetch(`${API_BASE_URL}/auth/login/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });

      const result: GoogleLoginResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Không thể bắt đầu đăng nhập Google");
      }

      if (result.status === "success" && result.data.url) {
        console.log("Redirecting to Google OAuth URL:", result.data.url);
        window.location.href = result.data.url;
      } else {
        throw new Error("Không nhận được URL đăng nhập Google");
      }
    } catch (error) {
      console.error("Google login error:", error);
      await Swal.fire({
        title: "Lỗi!",
        text: error instanceof Error ? error.message : "Đăng nhập Google thất bại. Vui lòng thử lại.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#db2777",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <div className="flex justify-center mb-8">
          <div className="relative w-32 h-32">
            <Image
              src="/logo.png"
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
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
              disabled={loading}
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
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-600 hover:text-pink-400"
                disabled={loading}
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
                disabled={loading}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Ghi nhớ đăng nhập
              </label>
            </div>

            <div className="text-sm">
              <Link href="/forgot-password" className="text-pink-600 hover:text-pink-700 font-medium">
                Quên mật khẩu?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 text-white bg-pink-600 rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Đăng nhập"}
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
            className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            <Image
              src="/gg.svg"
              alt="Google logo"
              width={20}
              height={20}
              className="mr-2"
            />
            Tiếp tục với Google
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="text-pink-600 hover:text-pink-700 font-medium">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}