"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { API_BASE_URL } from "@/config/config";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const [errors, setErrors] = useState({ 
    current_password: "", 
    new_password: "", 
    new_password_confirmation: "" 
  });
  const [email, setEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = () => {
      const userToken = Cookies.get("accessToken");
      const userData = Cookies.get("userData");

      if (!userToken || !userData) {
        console.log("Missing token or userData, redirecting to login");
        router.replace("/login");
        return;
      }

      try {
        const parsedUserData = JSON.parse(userData);
        setEmail(parsedUserData.email);
        setToken(userToken);
        setIsLoading(false);
      } catch (error) {
        console.error("Error parsing userData:", error);
        Cookies.remove("accessToken");
        Cookies.remove("userData");
        router.replace("/login");
      }
    };

    fetchUserData();
  }, [router]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-600 border-t-transparent"></div>
    </div>;
  }

  if (!token || !email) {
    return null;
  }

  const validatePassword = (password: string) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("Mật khẩu phải có ít nhất 8 ký tự");
    }
    return errors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear errors when user types
    setErrors(prev => ({ ...prev, [name]: "" }));
    
    // Validate password fields on change
    if (name === "new_password") {
      const passwordErrors = validatePassword(value);
      if (passwordErrors.length > 0) {
        setErrors(prev => ({ ...prev, new_password: passwordErrors[0] }));
      }
      
      // Check confirmation match if it exists
      if (formData.new_password_confirmation) {
        if (value !== formData.new_password_confirmation) {
          setErrors(prev => ({ 
            ...prev, 
            new_password_confirmation: "Mật khẩu xác nhận không khớp" 
          }));
        }
      }
    }

    if (name === "new_password_confirmation") {
      if (value !== formData.new_password) {
        setErrors(prev => ({ 
          ...prev, 
          new_password_confirmation: "Mật khẩu xác nhận không khớp" 
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { current_password, new_password, new_password_confirmation } = formData;

    // Validate all fields
    const passwordErrors = validatePassword(new_password);
    const newErrors = {
      current_password: current_password ? "" : "Mật khẩu hiện tại không được để trống",
      new_password: passwordErrors.length > 0 ? passwordErrors[0] : "",
      new_password_confirmation: new_password === new_password_confirmation ? "" : "Mật khẩu xác nhận không khớp",
    };

    if (newErrors.current_password || newErrors.new_password || newErrors.new_password_confirmation) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          current_password,
          new_password,
          new_password_confirmation,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Đổi mật khẩu thất bại");
      }

      await Swal.fire({
        title: "Thành công!",
        text: "Đổi mật khẩu thành công!",
        icon: "success",
        confirmButtonColor: "#db2777", // pink-600
      });

      // Xóa cả accessToken và userData như các trang khác
      Cookies.remove("accessToken");
      Cookies.remove("userData");
      router.push("/login");
    } catch (error) {
      console.error("Lỗi đổi mật khẩu:", error);
      await Swal.fire({
        title: "Lỗi!",
        text: (error as any).message || "Đã xảy ra lỗi khi đổi mật khẩu",
        icon: "error",
        confirmButtonColor: "#db2777", // pink-600
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white text-black">
      <div className="w-full max-w-md px-6 py-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Thay đổi mật khẩu
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email || ""}
              readOnly
              className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu hiện tại
            </label>
            <input
              type="password"
              name="current_password"
              value={formData.current_password}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent"
              required
            />
            {errors.current_password && (
              <p className="mt-1 text-sm text-red-500">{errors.current_password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu mới
            </label>
            <input
              type="password"
              name="new_password"
              value={formData.new_password}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent"
              required
            />
            {errors.new_password && (
              <p className="mt-1 text-sm text-red-500">{errors.new_password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Xác nhận mật khẩu mới
            </label>
            <input
              type="password"
              name="new_password_confirmation"
              value={formData.new_password_confirmation}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent"
              required
            />
            {errors.new_password_confirmation && (
              <p className="mt-1 text-sm text-red-500">
                {errors.new_password_confirmation}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 text-white bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-offset-2"
          >
            Đổi mật khẩu
          </button>
        </form>
      </div>
    </div>
  );
}