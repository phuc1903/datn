'use client'; // Đảm bảo thêm dòng này để sử dụng client-side tính năng nếu cần

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Clock, Phone } from 'lucide-react';

interface FooterProps {
  settings?: any[];
}

const Footer: React.FC<FooterProps> = ({ settings = [] }) => {
  // Lấy thông tin từ settings nếu có
  const contactInfo = settings?.find(item => item.name === "Contact")?.value
    ? JSON.parse(settings.find(item => item.name === "Contact").value)
    : {
        Address: '49 Trần Hưng Đạo, Phường Tân Thành, Quận Tân Phú',
        Phone: '0377461482',
        Email: 'zbeautyshop@gmail.com'
      };
  
  const footerHouseOpen = settings?.find(item => item.name === "FooterHouseOpen")?.value || 
    'Từ 9:00 - 21:30 tất cả các ngày trong tuần';
  
  const footerComplaints = settings?.find(item => item.name === "FooterComplaints")?.value || 
    '0377461482';
  
  const footerSlogan = settings?.find(item => item.name === "FooterSlogan")?.value || 
    'Chúng tôi cung cấp các sản phẩm mỹ phẩm chất lượng cao giúp bạn tỏa sáng mỗi ngày.';

  // Lấy logo footer từ settings
  const logoFooterLightMode = settings?.find(item => item.name === "logoFooterLightMode")?.value;
  
  // Lấy tên website từ settings
  const nameWebsite = settings?.find(item => item.name === "NameWebsite")?.value || "ZBEAUTY HCMC";

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        {/* Các phần tử trong Footer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Vùng logo và mô tả */}
          <div>
            <Link href="/" className="text-2xl font-bold text-pink-600 hover:text-pink-700">
              {nameWebsite.split(' - ')[0] || "ZBEAUTY"}
            </Link>
            <p className="mt-2 text-gray-400 text-sm">
              {footerSlogan}
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
            <h3 className="font-semibold text-lg text-gray-300">Thông tin liên hệ</h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start space-x-2 text-gray-400 text-sm">
                <span className="mt-1 flex-shrink-0">
                  <Clock size={16} />
                </span>
                <span>{footerHouseOpen}</span>
              </li>
              <li className="flex items-start space-x-2 text-gray-400 text-sm">
                <span className="mt-1 flex-shrink-0">
                  <Phone size={16} />
                </span>
                <span>
                  <strong>Hotline:</strong> {contactInfo?.Phone || '0377461482'}
                  <br />
                  <strong>CSKH:</strong> {footerComplaints}
                </span>
              </li>
              <li className="text-gray-400 text-sm mt-2">
                <strong className="block mb-1">Địa chỉ:</strong>
                <span>{contactInfo?.Address || '49 Trần Hưng Đạo, Phường Tân Thành, Quận Tân Phú'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Phần dưới cùng */}
        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} {nameWebsite}. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
