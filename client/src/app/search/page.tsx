"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { API_BASE_URL } from "@/config/config";

interface Product {
  id: number;
  name: string;
  image_url: string;
  price: number;
  promotion_price: number;
  skus: Array<{
    id: number;
    price: number;
    promotion_price: number;
    quantity: number;
  }>;
  images: Array<{
    id: number;
    image_url: string;
  }>;
}

const SearchResults = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortOption, setSortOption] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) {
          throw new Error('Không thể tải dữ liệu sản phẩm');
        }
        const data = await response.json();

        if (data?.data) {
          const filtered = data.data.filter((product: Product) =>
            product.name.toLowerCase().includes(query.toLowerCase())
          );
          setFilteredProducts(filtered);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError('Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
    const sortedProducts = [...filteredProducts];

    switch (e.target.value) {
      case "name-asc":
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        sortedProducts.sort((a, b) => {
          const priceA = a.skus[0]?.promotion_price > 0 ? a.skus[0].promotion_price : a.skus[0]?.price;
          const priceB = b.skus[0]?.promotion_price > 0 ? b.skus[0].promotion_price : b.skus[0]?.price;
          return (priceA || 0) - (priceB || 0);
        });
        break;
      case "price-desc":
        sortedProducts.sort((a, b) => {
          const priceA = a.skus[0]?.promotion_price > 0 ? a.skus[0].promotion_price : a.skus[0]?.price;
          const priceB = b.skus[0]?.promotion_price > 0 ? b.skus[0].promotion_price : b.skus[0]?.price;
          return (priceB || 0) - (priceA || 0);
        });
        break;
      default:
        break;
    }

    setFilteredProducts(sortedProducts);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-10 px-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Kết quả tìm kiếm: "{query}"</h1>

        {/* Bộ lọc */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">{filteredProducts.length} sản phẩm được tìm thấy</p>
          <select
            value={sortOption}
            onChange={handleSortChange}
            className="border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:border-pink-400 text-gray-700"
          >
            <option value="">Sắp xếp theo</option>
            <option value="name-asc">Tên (A-Z)</option>
            <option value="name-desc">Tên (Z-A)</option>
            <option value="price-asc">Giá (Thấp - Cao)</option>
            <option value="price-desc">Giá (Cao - Thấp)</option>
          </select>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              // Kiểm tra và sử dụng hình ảnh mặc định nếu cần
              let imageUrl = '/placeholder.jpg'; // Giá trị mặc định
              
              if (product.image_url && typeof product.image_url === 'string' && product.image_url.trim() !== '') {
                imageUrl = product.image_url;
              } else if (product.images && product.images.length > 0 && product.images[0]?.image_url) {
                imageUrl = product.images[0].image_url;
              }
              
              // Kiểm tra trạng thái hết hàng
              const isOutOfStock = product.skus[0]?.quantity === 0;
              
              return (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-square relative">
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      className={`object-cover ${isOutOfStock ? "" : "group-hover:scale-105"} transition-transform`}
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      priority={false}
                    />
                    
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-gray-800/60 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">Hết hàng</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div>
                        {product.skus[0]?.promotion_price > 0 ? (
                          <>
                            <p className="text-lg font-bold text-pink-600">
                              {product.skus[0].promotion_price.toLocaleString()}đ
                            </p>
                            <p className="text-sm text-gray-500 line-through">
                              {product.skus[0].price.toLocaleString()}đ
                            </p>
                          </>
                        ) : (
                          <p className="text-lg font-bold text-pink-600">
                            {product.skus[0]?.price.toLocaleString()}đ
                          </p>
                        )}
                      </div>
                      
                      {isOutOfStock && (
                        <span className="text-red-500 text-sm font-medium">Hết hàng</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-600">Không tìm thấy sản phẩm nào phù hợp với từ khóa "{query}"</p>
              <Link 
                href="/shop"
                className="mt-4 inline-block px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
              >
                Xem tất cả sản phẩm
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SearchPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
};

export default SearchPage;