"use client";
// pages/index.tsx
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Home() {
  // State for slider
  const [currentSlide, setCurrentSlide] = useState(0)
  const sliderImages = [
    '/banner/1.jpg',
    '/banner/2.jpg',
    '/banner/3.png',
  ]

  // Auto slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Slider Section */}
      <div className="relative h-[500px] w-full overflow-hidden">
        {sliderImages.map((image, index) => (
          <div
            key={index}
            className={`absolute w-full h-full transition-opacity duration-500 ${
              currentSlide === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="relative w-full h-full">
              <Image
                src={image}
                alt={`Slide ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          </div>
        ))}
        
        {/* Slider Controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {sliderImages.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full ${
                currentSlide === index ? 'bg-white' : 'bg-white/50'
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <section className="w-full px-4 py-12 bg-pink-100">
  <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Danh Mục Sản Phẩm</h2>
  <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
    {[
      { name: 'Chăm sóc da', image: '/oxy.jpg' },
      { name: 'Trang điểm', image: '/makup.jpg' },
      { name: 'Nước hoa', image: '/per.webp' },
      { name: 'Chăm sóc tóc', image: '/hair.avif' }
    ].map((category) => (
      <Link
        key={category.name}
        href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
        className="group relative h-48 bg-white rounded-lg shadow-md overflow-hidden"
      >
        {/* Hình ảnh nền */}
        <img
          src={category.image}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white text-xl font-semibold">{category.name}</span>
        </div>
      </Link>
    ))}
  </div>
</section>



      

      {/* Best Sellers Section */}
<section className="max-w-7xl mx-auto px-4 py-12">
  <div className="flex items-center justify-between mb-8">
    <h2 className="text-3xl font-bold text-gray-800">Sản Phẩm Bán Chạy</h2>
    <Link href="/bestsellers" className="text-pink-600 hover:text-pink-700 font-medium">
      Xem tất cả
    </Link>
  </div>
  
  {/* Bento Grid Layout */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Large Featured Item - Left Side */}
    <div className="relative bg-white rounded-lg shadow-lg overflow-hidden group md:h-[600px]">
      <div className="relative h-full">
        <Image
          src="/oxy.jpg"
          alt="Best Seller 1"
          fill
          className="object-cover transform transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-sm">
          Best Seller
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
          <h3 className="text-2xl font-semibold text-white mb-3 line-clamp-2">
            Sản phẩm bán chạy 1
          </h3>
          <div className="flex items-center gap-4 mb-3">
            <span className="text-white text-xl font-bold">799.000đ</span>
            <div className="text-sm text-gray-200">Đã bán: 1k+</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-yellow-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-lg">★</span>
              ))}
            </div>
            <button className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700">
              Thêm vào giỏ
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Stack of 3 Items - Right Side */}
    <div className="flex flex-col gap-4">
      {[2, 3, 4].map((item) => (
        <div
          key={item}
          className="relative bg-white rounded-lg shadow-lg overflow-hidden group h-[192px]"
        >
          <div className="relative h-full">
            <Image
              src={`/oxy.jpg`}
              alt={`Best Seller ${item}`}
              fill
              className="object-cover transform transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-sm">
              Best Seller
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <h3 className="text-base font-semibold text-white mb-2 line-clamp-1">
                Sản phẩm bán chạy {item}
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-white font-bold">799.000đ</span>
                  <div className="flex items-center text-yellow-400 text-sm">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star}>★</span>
                    ))}
                  </div>
                </div>
                <button className="bg-pink-600 text-white px-3 py-1 rounded text-sm hover:bg-pink-700">
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
{/* login ads */}
<section className=" py-16 overflow-hidden bg-pink-100">
  <div className="max-w-7xl mx-auto px-4">
    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
      {/* Text Content */}
      <div className="max-w-xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Đăng ký tài khoản tại ZBeauty
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Hãy đăng ký tài khoản trên website của chúng tôi để luôn nhận được thông tin mới nhất về sản phẩm, khuyến mãi và các sự kiện đặc biệt. Đảm bảo bạn không bỏ lỡ bất kỳ cơ hội hấp dẫn nào và tận hưởng những ưu đãi dành riêng cho thành viên. Đăng ký ngay!
        </p>
        <div className="flex gap-4">
          <button className="bg-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors">
            Đăng ký tài khoản
          </button>
          <button className="text-pink-600 hover:text-pink-700 font-medium">
            Xem tất cả sản phẩm
          </button>
        </div>
      </div>

      {/* Image Circle with Dots */}
      <div className="relative">
        <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full bg-pink-50 relative">
          <Image
            src="/person.jpg"
            alt="Person using phone"
            fill
            className="object-cover rounded-full p-4"
          />
          
          {/* Decorative Dots */}
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-white rounded-full border-4 border-pink-200" />
          <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-white rounded-full border-4 border-pink-200" />
          <div className="absolute top-1/2 -right-4 w-8 h-8 bg-white rounded-full border-4 border-pink-200" />
          
          {/* Stats Badge */}
          <div className="absolute -right-4 top-8 bg-white px-4 py-2 rounded-lg shadow-lg">
            <div className="text-xl font-bold text-gray-900">1850+</div>
            <div className="text-sm text-gray-600">Người dùng</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

 {/* Featured Products by Category */}
{['Chăm sóc da', 'Trang điểm', 'Nước hoa', 'Chăm sóc tóc'].map((category, index) => (
  <section
    key={category}
    className={`w-full px-4 py-12 ${
      index % 2 === 0 ? 'bg-white' : 'bg-pink-100'
    }`}
  >
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">{category}</h2>
        <Link
          href={`/category/${category.toLowerCase()}`}
          className="text-pink-600 hover:text-pink-700 font-medium"
        >
          Xem tất cả
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="relative bg-white rounded-lg shadow-md overflow-hidden group p-4"
          >
            <div className="relative w-full aspect-square mb-4 overflow-hidden">
              <Image
                src={`/oxy.jpg`}
                alt={`${category} Product ${item}`}
                fill
                className="object-cover transform transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {['Sữa rửa mặt', 'Dưỡng da', 'Kem chống nắng'].map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-green-100 text-green-600 text-xs font-medium px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h3 className="text-sm font-medium mb-2 line-clamp-2 text-gray-800">
              {`Kem dưỡng da La Roche-Posay Cicaplast Baume B5+ hỗ trợ làm dịu...`}
            </h3>
            <div className="mb-4">
              <span className="line-through text-gray-500 text-sm mr-2">130.000đ</span>
              <span className="text-pink-600 font-bold text-lg">120.000đ</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-yellow-500 text-sm ml-2">★ 4.9</span>
              <button className="bg-pink-600 text-white py-2 px-4 rounded text-sm hover:bg-pink-700">
                Mua ngay
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
))}





{/* Brand List
<section className="max-w-7xl mx-auto px-4 py-12">
  <h2 className="text-3xl font-bold text-gray-800 mb-8">Thương hiệu nổi bật</h2>
  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
    {['Xmen', 'Brand2', 'Brand3', 'Brand4', 'Brand5', 'Brand6'].map((brand) => (
      <div key={brand} className="bg-gray-50 rounded-lg shadow-md p-4 text-center">
        <Image
          src={`/xmen.png`}
          alt={brand}
          width={80}
          height={80}
          className="mx-auto mb-4"
        />
        <p className="text-sm text-black font-medium">{brand}</p>
      </div>
    ))}
  </div>
</section> */}

{/* Customer Reviews
<section className="bg-pink-100 py-12">
  <div className="max-w-7xl mx-auto px-4">
    <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Đánh giá từ khách hàng</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((review) => (
        <div key={review} className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-700 italic mb-4">
            "Sản phẩm rất tuyệt vời, da mình mềm mại hơn sau 2 tuần sử dụng. Sẽ tiếp tục mua!"
          </p>
          <div className="flex items-center">
            <Image
              src={`/user1.jpg`}
              alt={`Customer ${review}`}
              width={50}
              height={50}
              className="rounded-full mr-4"
            />
            <div>
              <h4 className="text-gray-800 font-bold">Nguyễn Thị A</h4>
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star}>★</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section> */}

{/* Blog Section */}
<section className="max-w-7xl mx-auto px-4 py-12">
  <h2 className="text-3xl font-bold text-gray-800 mb-8">Góc làm đẹp</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3].map((blog) => (
      <div key={blog} className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative aspect-video">
          <Image
            src={`/banner/1.jpg`}
            alt={`Blog ${blog}`}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg text-black font-bold mb-2">Cách chăm sóc da mùa đông</h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            Mùa đông là thời điểm da dễ bị khô và nứt nẻ. Hãy tham khảo các mẹo chăm sóc da đơn giản để giữ da luôn mịn màng.
          </p>
          <Link
            href={`/blog/${blog}`}
            className="text-pink-600 hover:text-pink-700 font-medium"
          >
            Đọc thêm
          </Link>
        </div>
      </div>
    ))}
  </div>
</section>

{/* teamteam */}
{/* Team Section */}
<section className="bg-pink-100 py-16">
  <div className="max-w-7xl mx-auto px-4">
    {/* Header */}
    <div className="flex items-center justify-between mb-12">
      <h2 className="text-3xl font-bold text-gray-900">
        Đội ngũ xây dựng thương hiệu ZBeauty
      </h2>
      <Link href="/team" className="text-pink-600 hover:text-pink-700">
        Xem tất cả
      </Link>
    </div>

    {/* Team Carousel */}
    <div className="relative">
      {/* Previous Button */}
      <button 
        className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center z-10 hover:bg-gray-50"
        aria-label="Previous slide"
      >
        <svg 
          className="w-6 h-6 text-gray-600" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mx-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="bg-white rounded-xl p-6 shadow-sm">
            {/* Avatar */}
            <div className="w-32 h-32 mx-auto mb-4">
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <Image
                  src="/person.jpg"
                  alt="crew"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Info */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Crew Member
              </h3>
              
              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-sm">0123456789</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">crew9@gmail.com</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 line-clamp-3">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.Lorem ipsum dolor sit amet, co...
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Next Button */}
      <button 
        className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center z-10 hover:bg-gray-50"
        aria-label="Next slide"
      >
        <svg 
          className="w-6 h-6 text-gray-600" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</section>

{/* FAQ or Support Section */}
<section className="max-w-7xl mx-auto px-4 py-12 bg-gray-50">
  <h2 className="text-3xl font-bold text-gray-800 mb-8">Hỗ trợ khách hàng</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[
      { question: 'Làm sao để đặt hàng?', answer: 'Bạn có thể đặt hàng trực tiếp trên website hoặc liên hệ qua hotline.' },
      { question: 'Chính sách đổi trả là gì?', answer: 'Chúng tôi hỗ trợ đổi trả trong vòng 7 ngày kể từ khi nhận hàng.' },
      { question: 'Sản phẩm có chính hãng không?', answer: 'Tất cả sản phẩm đều được nhập khẩu chính hãng và có hóa đơn.' },
    ].map((faq, index) => (
      <div key={index} className="bg-white rounded-lg shadow-md p-6">
        <h4 className="font-bold text-gray-800 mb-2">{faq.question}</h4>
        <p className="text-sm text-gray-600">{faq.answer}</p>
      </div>
    ))}
  </div>
</section>

      {/* Newsletter Section */}
      <section className="bg-pink-100 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Đăng ký nhận tin</h2>
          <p className="text-gray-600 mb-8">
            Nhận thông tin về sản phẩm mới và khuyến mãi hấp dẫn
          </p>
          <form className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              Đăng ký
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}