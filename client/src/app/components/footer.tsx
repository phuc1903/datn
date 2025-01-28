'use client'; // Đảm bảo thêm dòng này để sử dụng client-side tính năng nếu cần

import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        {/* Các phần tử trong Footer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Vùng logo và mô tả */}
          <div>
            <Link href="/" className="text-2xl font-bold text-pink-600 hover:text-pink-700">
              ZBEAUTY HCMC
            </Link>
            <p className="mt-2 text-gray-400 text-sm">
              Chúng tôi cung cấp các sản phẩm mỹ phẩm chất lượng cao giúp bạn tỏa sáng mỗi ngày.
            </p>
          </div>

          {/* Các liên kết nhanh */}
          <div>
            <h3 className="font-semibold text-lg text-gray-300">Liên kết</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-pink-600 text-sm">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-pink-600 text-sm">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-400 hover:text-pink-600 text-sm">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-gray-400 hover:text-pink-600 text-sm">
                  Điều khoản dịch vụ
                </Link>
              </li>
            </ul>
          </div>

          {/* Mạng xã hội */}
          <div>
            <h3 className="font-semibold text-lg text-gray-300">Kết nối với chúng tôi</h3>
            <div className="mt-4 flex space-x-4">
              <Link href="https://facebook.com" target="_blank" className="text-gray-400 hover:text-pink-600">
                <Facebook size={24} />
              </Link>
              <Link href="https://instagram.com" target="_blank" className="text-gray-400 hover:text-pink-600">
                <Instagram size={24} />
              </Link>
              <Link href="https://twitter.com" target="_blank" className="text-gray-400 hover:text-pink-600">
                <Twitter size={24} />
              </Link>
            </div>
          </div>

          {/* Địa chỉ */}
          <div>
            <h3 className="font-semibold text-lg text-gray-300">Liên hệ</h3>
            <p className="mt-4 text-gray-400 text-sm">
              Địa chỉ: 1234 Đường ABC, Thành phố XYZ, Việt Nam
            </p>
            <p className="mt-2 text-gray-400 text-sm">
              Email: support@mycosmetics.com
            </p>
            <p className="mt-2 text-gray-400 text-sm">
              Số điện thoại: +84 123 456 789
            </p>
          </div>
        </div>

        {/* Dòng bản quyền */}
        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-400 text-sm">
          <p>&copy; 2025 MyCosmetics. Tất cả quyền được bảo vệ.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
