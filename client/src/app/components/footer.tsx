'use client'; // Đảm bảo thêm dòng này để sử dụng client-side tính năng nếu cần

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Clock, Phone } from 'lucide-react';

const Footer = () => {
  // Thay thế các giá trị từ Settings bằng giá trị tĩnh
  const contactInfo = {
    Address: '49 Trần Hưng Đạo, Phường Tân Thành, Quận Tân Phú',
    Phone: '0377461482',
    Email: 'zbeautyshop@gmail.com'
  };
  const footerHouseOpen = 'Từ 9:00 - 21:30 tất cả các ngày trong tuần';
  const footerComplaints = '0377461482';

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
                <Link href="#" className="text-gray-400 hover:text-pink-600 text-sm">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-pink-600 text-sm">
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

          {/* Địa chỉ và thông tin liên hệ */}
          <div>
            <h3 className="font-semibold text-lg text-gray-300">Liên hệ</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm">
                  {contactInfo.Address}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex-shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <p className="text-gray-400 text-sm">
                  {footerHouseOpen}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex-shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">
                    {contactInfo.Phone}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    {contactInfo.Email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dòng bản quyền và khiếu nại */}
        <div className="mt-8 border-t border-gray-700 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              &copy; 2025 Zbeauty. Tất cả quyền được bảo vệ.
            </p>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Phone className="h-4 w-4" />
              <span>Hotline khiếu nại: {footerComplaints}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
