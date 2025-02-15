"use client"
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slider images
  const sliderImages = [
    '/banner/1.jpg',
    '/banner/2.jpg',
    '/banner/3.png',
  ];
  
  const getRandomItems = (arr, num) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  };
  
  useEffect(() => {
    // Slider auto-scroll effect
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);

    // Fetch products
    fetch("http://127.0.0.1:8000/api/v1/products")
      .then((res) => res.json())
      .then((data) => {
        const inStockProducts = data.data.filter(product => product.status !== "out_of_stock");
        setProducts(inStockProducts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });

    // Fetch categories
    fetch("http://127.0.0.1:8000/api/v1/categories")
      .then((res) => res.json())
      .then((data) => {
        const parentCategories = data.data.filter(cat => cat.parent_id === 0);
        const randomCategories = getRandomItems(parentCategories, 4);
        setCategories(randomCategories);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });

    return () => clearInterval(timer);
  }, []);

  if (loading) return <p className="text-center text-lg">Đang tải dữ liệu...</p>;

  const hotProducts = getRandomItems(products.filter(p => p.is_hot), 4);
  const newProducts = getRandomItems(
    products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
    5
  );
  const recommended = getRandomItems(products, 5);

  const categoryImages = {
    0: '/oxy.jpg',
    1: '/makup.jpg',
    2: '/per.webp',
    3: '/hair.avif'
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Slider Section */}
      <section className="w-full px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="relative h-[400px] w-full overflow-hidden rounded-lg">
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
        </div>
      </section>

      {/* Categories Section */}
      <section className="w-full px-4 py-12 bg-pink-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Danh Mục Sản Phẩm</h2>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group relative h-48 bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={categoryImages[index]}
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
          <h2 className="text-3xl font-bold text-gray-800">Sản Phẩm Hot</h2>
          <Link href="/bestsellers" className="text-pink-600 hover:text-pink-700 font-medium">
            Xem tất cả
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hotProducts.length > 0 && (
            <Link href={`/product/${hotProducts[0].id}`} className="block">
              <div className="relative bg-white rounded-lg shadow-lg overflow-hidden group md:h-[600px]">
                <div className="relative h-full">
                  <Image 
                    src={hotProducts[0].images?.[0]?.image_url || "/oxy.jpg"} 
                    alt={hotProducts[0].name} 
                    fill 
                    className="object-cover transform transition-transform duration-300 group-hover:scale-105" 
                  />
                 
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                    <h3 className="text-2xl font-semibold text-white mb-3 line-clamp-2">
                      {hotProducts[0].name}
                    </h3>
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-white text-xl font-bold">{hotProducts[0].skus?.[0]?.price.toLocaleString()}đ</span>
                      <div className="text-sm text-gray-200">Đã bán: 1k+</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-yellow-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className="text-lg">★</span>
                        ))}
                      </div>
                      <button className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700">
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}
          <div className="flex flex-col gap-4">
            {hotProducts.slice(1, 4).map((product) => (
              <Link href={`/product/${product.id}`} key={product.id} className="block">
                <div className="relative bg-white rounded-lg shadow-lg overflow-hidden group h-[192px]">
                  <div className="relative h-full">
                    <Image 
                      src={product.images?.[0]?.image_url || "/oxy.jpg"} 
                      alt={product.name} 
                      fill 
                      className="object-cover transform transition-transform duration-300 group-hover:scale-105" 
                    />
                   
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h3 className="text-base font-semibold text-white mb-2 line-clamp-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-white font-bold">{product.skus?.[0]?.price.toLocaleString()}đ</span>
                          <div className="flex items-center text-yellow-400 text-sm">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star}>★</span>
                            ))}
                          </div>
                        </div>
                        <button className="bg-pink-600 text-white px-3 py-1 rounded text-sm hover:bg-pink-700">
                          Xem chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
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
        <Link href="/register">
        <button className="bg-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors">
          Đăng ký tài khoản
        </button>
      </Link>
      <Link href="/product">
        <button className="bg-white text-pink-600 px-6 py-3 rounded-lg font-medium hover:bg-pink-600 hover:text-white transition-colors">
          Xem tất cả sản phẩm
        </button>
      </Link>
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
      {/* New Products Section */}
      <section className="w-full px-4 py-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Sản phẩm mới</h2>
            <Link href="/new-products" className="text-pink-600 hover:text-pink-700 font-medium">
              Xem tất cả
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {newProducts.map((product) => (
              <Link href={`/product/${product.id}`} key={product.id} className="block">
                <div className="relative bg-white rounded-lg shadow-md overflow-hidden group p-4">
                  <div className="relative w-full aspect-square mb-4 overflow-hidden">
                    <Image
                      src={product.images?.[0]?.image_url || "/oxy.jpg"}
                      alt={product.name}
                      fill
                      className="object-cover transform transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {['Sữa rửa mặt', 'Dưỡng da', 'Kem chống nắng'].map((tag, idx) => (
                      <span key={idx} className="bg-green-100 text-green-600 text-xs font-medium px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-sm font-medium mb-2 line-clamp-2 text-gray-800">
                    {product.name}
                  </h3>
                  <div className="mb-4">
                    <span className="line-through text-gray-500 text-sm mr-2">{product.skus?.[0]?.price.toLocaleString()}đ</span>
                    <span className="text-pink-600 font-bold text-lg">{product.skus?.[0]?.price.toLocaleString()}đ</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-yellow-500 text-sm ml-2">★ 4.9</span>
                    <button className="bg-pink-600 text-white py-2 px-4 rounded text-sm hover:bg-pink-700">
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Section */}
      <section className="w-full px-4 py-12 bg-pink-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Dành cho bạn</h2>
            <Link href="/recommended" className="text-pink-600 hover:text-pink-700 font-medium">
              Xem tất cả
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {recommended.map((product) => (
              <Link href={`/product/${product.id}`} key={product.id} className="block">
                <div className="relative bg-white rounded-lg shadow-md overflow-hidden group p-4">
                  <div className="relative w-full aspect-square mb-4 overflow-hidden">
                    <Image
                      src={product.images?.[0]?.image_url || "/oxy.jpg"}
                      alt={product.name}
                      fill
                      className="object-cover transform transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {['Sữa rửa mặt', 'Dưỡng da', 'Kem chống nắng'].map((tag, idx) => (
                      <span key={idx} className="bg-green-100 text-green-600 text-xs font-medium px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-sm font-medium mb-2 line-clamp-2 text-gray-800">
                    {product.name}
                  </h3>
                  <div className="mb-4">
                    <span className="line-through text-gray-500 text-sm mr-2">{product.skus?.[0]?.price.toLocaleString()}đ</span>
                    <span className="text-pink-600 font-bold text-lg">{product.skus?.[0]?.price.toLocaleString()}đ</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-yellow-500 text-sm ml-2">★ 4.9</span>
                    <button className="bg-pink-600 text-white py-2 px-4 rounded text-sm hover:bg-pink-700">
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </Link>
            ))}
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
  );
}