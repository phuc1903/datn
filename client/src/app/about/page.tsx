import Image from "next/image";

export default function About() {
  // Thay thế dữ liệu động từ API bằng dữ liệu tĩnh
  const aboutContent = `
    <h2>Chào mừng đến với ZBeauty</h2>
    
    <p>ZBeauty là thương hiệu mỹ phẩm hàng đầu tại Việt Nam, chuyên cung cấp các sản phẩm chăm sóc da, trang điểm và làm đẹp chất lượng cao. Chúng tôi tin rằng vẻ đẹp thực sự đến từ sự tự tin và khỏe mạnh từ bên trong.</p>
    
    <h3>Câu chuyện của chúng tôi</h3>
    
    <p>Được thành lập vào năm 2018, ZBeauty ra đời với sứ mệnh mang đến những sản phẩm làm đẹp an toàn, hiệu quả và phù hợp với làn da của người Việt Nam. Chúng tôi hiểu rằng mỗi làn da đều có những nhu cầu khác nhau, và vì vậy, chúng tôi không ngừng nghiên cứu và phát triển các dòng sản phẩm đáp ứng đa dạng nhu cầu của khách hàng.</p>
    
    <h3>Giá trị cốt lõi</h3>
    
    <ul>
      <li><strong>Chất lượng:</strong> Cam kết mang đến những sản phẩm chất lượng cao nhất.</li>
      <li><strong>An toàn:</strong> Sản phẩm được kiểm nghiệm nghiêm ngặt, không chứa paraben và các chất độc hại.</li>
      <li><strong>Đổi mới:</strong> Liên tục nghiên cứu và phát triển công thức mới, kết hợp khoa học và thiên nhiên.</li>
      <li><strong>Bền vững:</strong> Thân thiện với môi trường từ nguyên liệu đến bao bì.</li>
    </ul>
    
    <h3>Cam kết của chúng tôi</h3>
    
    <p>Tại ZBeauty, chúng tôi cam kết:</p>
    
    <ul>
      <li>Không thử nghiệm trên động vật</li>
      <li>Sử dụng nguyên liệu có nguồn gốc rõ ràng</li>
      <li>Giảm thiểu tác động đến môi trường</li>
      <li>Hỗ trợ cộng đồng địa phương</li>
    </ul>
    
    <p>Chúng tôi tin tưởng rằng với sự đồng hành của ZBeauty, mọi người đều có thể tự tin tỏa sáng với vẻ đẹp tự nhiên của mình.</p>
  `;

  return (
    <main className="bg-white min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-6 md:px-8">
        {/* Gradient banner thay vì sử dụng hình ảnh */}
        <div className="mb-10 relative h-48 md:h-64 rounded-xl overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-pink-400 flex items-center justify-center">
            <h1 className="text-white text-3xl md:text-4xl font-bold drop-shadow-lg px-4 text-center">
              Giới thiệu về ZBeauty
            </h1>
          </div>
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-20"></div>
        </div>

        {/* Nội dung giới thiệu */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
          <div 
            className="prose prose-lg md:prose-xl max-w-none prose-headings:text-pink-700 prose-a:text-pink-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-pink-700 prose-img:rounded-lg prose-img:shadow-md"
            dangerouslySetInnerHTML={{ 
              __html: aboutContent
            }}
          />
        </div>
      </div>
    </main>
  );
}
