"use client"
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Di chuyển hàm getRandomItems lên trước useEffect
  const getRandomItems = (arr, num) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  };
  
  useEffect(() => {
    // Fetch products
    fetch("http://127.0.0.1:8000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });

    // Fetch categories
    fetch("http://127.0.0.1:8000/api/categories")
      .then((res) => res.json())
      .then((data) => {
        // Filter only parent categories (parent_id: 0) and get random 4
        const parentCategories = data.data.filter(cat => cat.parent_id === 0);
        const randomCategories = getRandomItems(parentCategories, 4);
        setCategories(randomCategories);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  if (loading) return <p className="text-center text-lg">Đang tải dữ liệu...</p>;

  const hotProducts = getRandomItems(products.filter(p => p.is_hot), 4);
  const newProducts = getRandomItems(products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)), 5);
  const recommended = getRandomItems(products, 5);

  // Define fixed images for categories
  const categoryImages = {
    0: '/oxy.jpg',
    1: '/makup.jpg',
    2: '/per.webp',
    3: '/hair.avif'
  };

  return (
    <main className="min-h-screen bg-gray-50">
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
    </main>
  );
}