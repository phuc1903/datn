import Image from "next/image";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative w-full h-80">
        <Image
          src="/banner/1.jpg"
          alt="Liên hệ"
          layout="fill"
          objectFit="cover"
          className="rounded-lg shadow-md"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold">Liên Hệ</h1>
        </div>
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
          <div className="bg-gray-100 p-8 rounded-lg shadow-lg">
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
                      d="M3 10l1.664 8.328A2 2 0 006.632 20h10.736a2 2 0 001.968-1.672L21 10M5 10l7 7m0 0l7-7m-7 7V4"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-800 font-medium">Email</p>
                  <p className="text-gray-600">support@example.com</p>
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
                      d="M5.121 17.804a3.998 3.998 0 010-5.658m13.658 5.658a3.998 3.998 0 010-5.658M8.464 12a5 5 0 117.072 0m-7.072 0a7 7 0 1010 0m-10 0a9 9 0 1112.364-7.636M12 6v6m0 0l4-4m-4 4L8 8"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-800 font-medium">Điện thoại</p>
                  <p className="text-gray-600">+84 123 456 789</p>
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
                      d="M8 17l-4-4m0 0l4-4m-4 4h16"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-800 font-medium">Địa chỉ</p>
                  <p className="text-gray-600">123 Đường ABC, Quận XYZ, TP.HCM</p>
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
