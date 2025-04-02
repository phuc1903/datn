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
  }>;
  images: string[];
}

const SearchResults = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products`);
        const data = await response.json();

        if (data?.data) {
          const filtered = data.data.filter((product: Product) =>
            product.name.toLowerCase().includes(query.toLowerCase())
          );
          setFilteredProducts(filtered);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [query]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
    const sortedProducts = [...filteredProducts];

    switch (e.target.value) {
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
            filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square relative">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
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
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-600 col-span-full text-center">Không tìm thấy sản phẩm nào.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const SearchPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
};

export default SearchPage;