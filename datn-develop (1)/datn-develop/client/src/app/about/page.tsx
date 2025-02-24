import Image from "next/image";

export default function Home() {
  return (
    <main className="bg-gray-50 min-h-screen flex flex-col items-center justify-center">
      {/* Phần giới thiệu chính */}
      <section className="max-w-4xl mx-auto text-center p-6">
        {/* Hero Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Chào mừng đến với nền tảng tuyệt vời của chúng tôi
          </h1>
          <p className="text-gray-600 text-lg">
            Khám phá các giải pháp tốt nhất về thiết kế UI/UX, phát triển web, 
            và nhiều hơn thế nữa. Tất cả đều được thiết kế đẹp mắt và thân thiện với người dùng!
          </p>
        </div>

        {/* Hình ảnh minh họa */}
        <div className="relative w-full h-80 mb-8">
  <Image
    src="/banner/1.jpg" // Thay bằng URL của ảnh bạn muốn
    alt="Ảnh minh họa"
    fill // Tương đương với `layout="fill"`
    className="rounded-lg shadow-md object-cover"
  />
</div>


        {/* Phần tính năng nổi bật */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-white shadow-lg rounded-lg">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Thân thiện với người dùng
            </h3>
            <p className="text-gray-600">
              Giao diện trực quan, dễ sử dụng giúp trải nghiệm mượt mà.
            </p>
          </div>
          <div className="p-4 bg-white shadow-lg rounded-lg">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Hiệu suất cao
            </h3>
            <p className="text-gray-600">
              Hiệu năng nhanh và ổn định cho trải nghiệm liền mạch.
            </p>
          </div>
          <div className="p-4 bg-white shadow-lg rounded-lg">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Dễ dàng tùy chỉnh
            </h3>
            <p className="text-gray-600">
              Các giải pháp phù hợp với nhu cầu cụ thể của bạn.
            </p>
          </div>
        </div>
      </section>

      {/* Phần kêu gọi hành động */}
      <section className="bg-pink-600 w-full text-center py-10 mt-12">
        <h2 className="text-2xl text-white font-bold mb-4">
          Sẵn sàng để bắt đầu?
        </h2>
        <p className="text-pink-200 mb-6">
          Đăng ký ngay hôm nay và nâng tầm thiết kế của bạn!
        </p>
        <button className="bg-white text-pink-600 px-6 py-2 rounded-lg font-semibold hover:bg-pink-200 transition">
          Bắt đầu ngay
        </button>
      </section>
    </main>
  );
}
