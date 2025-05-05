import Image from "next/image";

export default function Contact() {
  // Thay thế dữ liệu từ API bằng dữ liệu tĩnh
  const contactInfo = {
    Email: 'zbeautyshop@gmail.com',
    Phone: '0377461482',
    Address: '49 Trần Hưng Đạo, Phường Tân Thành, Quận Tân Phú'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative w-full h-48 md:h-64">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-pink-400 flex items-center justify-center">
          <h1 className="text-white text-3xl md:text-4xl font-bold drop-shadow-lg px-4 text-center">
            Liên Hệ
          </h1>
        </div>
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-20"></div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Gửi tin nhắn cho chúng tôi
            </h2>
            <p className="text-gray-600 mb-6">
              Nếu bạn có câu hỏi hoặc cần hỗ trợ, hãy để lại tin nhắn, chúng tôi sẽ liên lạc với bạn sớm nhất!
            </p>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Tên của bạn</label>
                <input
                  type="text"
                  placeholder="Nhập tên của bạn"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Email</label>
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Tin nhắn</label>
                <textarea
                  rows={4}
                  placeholder="Nhập tin nhắn của bạn"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-500 transition"
              >
                Gửi Tin Nhắn
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Thông tin liên lạc</h2>
            <p className="text-gray-600 mb-6">
              Bạn cũng có thể liên hệ trực tiếp với chúng tôi qua thông tin dưới đây:
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-pink-100 text-pink-600 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-800 font-medium">Email</p>
                  <p className="text-gray-600">{contactInfo.Email}</p>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-pink-100 text-pink-600 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-800 font-medium">Điện thoại</p>
                  <p className="text-gray-600">{contactInfo.Phone}</p>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-pink-100 text-pink-600 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
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
                <div>
                  <p className="text-gray-800 font-medium">Địa chỉ</p>
                  <p className="text-gray-600">{contactInfo.Address}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Bản đồ</h2>
          <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.760354551014!2d106.65320671526095!3d10.762622292326444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752eced98a1b6f%3A0x2ec8d6ccaa1ae95c!2zMTIzIMSQxrDhu51uZyBBQkMsIFF14bqjbmcgWFlaLCBUUC5IQ00!5e0!3m2!1sen!2s!4v1617187171711!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
