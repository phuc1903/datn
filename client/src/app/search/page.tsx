"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/products");
        const data = await response.json();

        if (data?.data) {
          const filtered = data.data.filter((product) =>
            product.name.toLowerCase().includes(query.toLowerCase())
          );
          setProducts(filtered);
          setFilteredProducts(filtered);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    if (query) fetchProducts();
  }, [query]);

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortOption(value);
    let sortedProducts = [...products];

    switch (value) {
      case "name-asc":
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        sortedProducts.sort((a, b) => (a.skus?.[0]?.price || 0) - (b.skus?.[0]?.price || 0));
        break;
      case "price-desc":
        sortedProducts.sort((a, b) => (b.skus?.[0]?.price || 0) - (a.skus?.[0]?.price || 0));
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
              <div key={product.id} className="bg-white border rounded-lg shadow-md p-4">
                <Link href={`/product/${product.id}`}>
                  <div className="relative w-full h-48 rounded-lg overflow-hidden">
                    <Image
                      src={product.images?.length > 0 ? product.images[0].image_url : "/default-product.jpg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mt-4">{product.name}</h3>
                  <p className="text-pink-600 font-bold mt-2">
                    {product.skus?.[0]?.price ? `${product.skus[0].price.toLocaleString()}đ` : "Liên hệ"}
                  </p>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-gray-600 col-span-full text-center">Không tìm thấy sản phẩm nào.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;