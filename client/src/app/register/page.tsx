"use client";
// Đánh dấu component này là Client Component để sử dụng hooks và state

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Upload } from "lucide-react"; // Import các icon từ thư viện Lucide
import Swal from "sweetalert2"; // Thư viện hiển thị modal thông báo đẹp
import { API_BASE_URL } from "@/config/config";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false); // State quản lý trạng thái loading
  const [showPassword, setShowPassword] = useState(false); // State hiển thị/ẩn mật khẩu
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State hiển thị/ẩn xác nhận mật khẩu
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null); // State preview ảnh đại diện

  // State chứa dữ liệu form đăng ký
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
    confirmPassword: "",
    avatar: null as File | null
  });

  // Xử lý thay đổi input text
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý thay đổi file ảnh đại diện
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Cập nhật state với file đã chọn
      setFormData((prev) => ({
        ...prev,
        avatar: file
      }));
      
      // Tạo URL preview cho ảnh
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Kiểm tra tính hợp lệ của mật khẩu
  const validatePassword = () => {
    // Kiểm tra độ dài mật khẩu tối thiểu là 8 ký tự
    if (formData.password.length < 8) {
      Swal.fire({
        title: 'Lỗi!',
        text: 'Mật khẩu phải có ít nhất 8 ký tự!',
        icon: 'error',
        confirmButtonText: 'Đồng ý',
        confirmButtonColor: '#ec4899'
      });
      return false;
    }

    // Kiểm tra mật khẩu xác nhận phải trùng khớp
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        title: 'Lỗi!',
        text: 'Mật khẩu xác nhận không khớp!',
        icon: 'error',
        confirmButtonText: 'Đồng ý',
        confirmButtonColor: '#ec4899'
      });
      return false;
    }

    return true;
  };

  // Xử lý submit form đăng ký
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Kiểm tra tính hợp lệ của mật khẩu trước khi submit
    if (!validatePassword()) {
      return;
    }
    
    setLoading(true);

    // Tạo FormData để gửi dữ liệu lên server, bao gồm cả file
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      // Loại bỏ trường confirmPassword và chỉ thêm vào các trường có giá trị
      if (key !== 'confirmPassword' && value !== null) {
        formDataToSend.append(key, value);
      }
    });

    try {
      // Gọi API đăng ký
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        // Hiển thị thông báo đăng ký thành công
        await Swal.fire({
          title: 'Thành công!',
          text: 'Đăng ký tài khoản thành công!',
          icon: 'success',
          confirmButtonText: 'Đồng ý',
          confirmButtonColor: '#ec4899'
        });
        // Chuyển hướng đến trang đăng nhập
        router.push("/login");
      } else {
        // Hiển thị thông báo lỗi từ server
        Swal.fire({
          title: 'Lỗi!',
          text: data.message || 'Đăng ký thất bại',
          icon: 'error',
          confirmButtonText: 'Đồng ý',
          confirmButtonColor: '#ec4899'
        });
      }
    } catch (error) {
      // Xử lý lỗi kết nối
      console.error("Lỗi kết nối:", error);
      Swal.fire({
        title: 'Lỗi!',
        text: 'Không thể kết nối đến server!',
        icon: 'error',
        confirmButtonText: 'Đồng ý',
        confirmButtonColor: '#ec4899'
      });
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 text-black">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div>
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Đăng ký</h2>

        {/* Upload ảnh đại diện */}
        <div className="mb-6 flex flex-col items-center">
          <div className="w-24 h-24 mb-4 relative">
            {avatarPreview ? (
              // Hiển thị preview ảnh nếu đã chọn
              <img
                src={avatarPreview}
                alt="Avatar preview"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              // Hiển thị icon Upload nếu chưa chọn ảnh
              <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          {/* Nút chọn ảnh đại diện */}
          <label className="cursor-pointer bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
            <span className="text-sm text-gray-600">Chọn ảnh đại diện</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </label>
        </div>

        {/* Form đăng ký */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Họ và tên */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="example@email.com"
              required
            />
          </div>

          {/* Số điện thoại */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="0123456789"
              required
            />
          </div>

          {/* Mật khẩu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Tối thiểu 8 ký tự"
                required
              />
              {/* Nút hiển thị/ẩn mật khẩu */}
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
              </button>
            </div>
          </div>

          {/* Xác nhận mật khẩu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Nhập lại mật khẩu"
                required
              />
              {/* Nút hiển thị/ẩn xác nhận mật khẩu */}
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
              </button>
            </div>
          </div>

          {/* Nút đăng ký */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
              loading ? "bg-pink-300" : "bg-pink-500 hover:bg-pink-600"
            } transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2`}
          >
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </button>
        </form>

        {/* Link đến trang đăng nhập */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Đã có tài khoản?{" "}
            <Link href="/login" className="text-pink-500 hover:text-pink-600 font-medium">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}