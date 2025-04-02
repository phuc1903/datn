"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronUp, ChevronDown, Search } from "lucide-react";
import Link from "next/link";
import { API_BASE_URL } from "@/config/config";

interface Category {
  id: number;
  name: string;
  subcategories?: Category[];
}

interface Product {
  id: number;
  name: string;
  image_url: string;
  short_description?: string;
  rating?: number;
  categories: Category[];
  images?: Array<{
    image_url: string;
  }>;
  skus: Array<{
    id: number;
    price: number;
    promotion_price: number;
  }>;
}

interface CategoryGroup {
  id: string;
  name: string;
  subcategories: Category[];
}

interface ExpandedCategories {
  [key: string]: boolean;
}

interface FilterSearchHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const FilterSearchHeader = ({ searchTerm, setSearchTerm }: FilterSearchHeaderProps) => {
  return (
    <div className="w-full mb-6 border-b border-gray-300 pb-4">
      <div className="flex items-center gap-4">
        <div className="flex-grow relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <Search className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

const ProductListingPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sortOrder, setSortOrder] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<ExpandedCategories>({});
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products`);
        const data = await response.json();
        if (data.status === "success") {
          setProducts(data.data);
          setFilteredProducts(data.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        const data = await response.json();
        if (data.status === "success") {
          setCategories(data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    const updatedProducts = products.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortOrder === "Giá từ thấp đến cao") {
      updatedProducts.sort(
        (a, b) => a.skus[0].promotion_price - b.skus[0].promotion_price
      );
    } else if (sortOrder === "Giá từ cao đến thấp") {
      updatedProducts.sort(
        (a, b) => b.skus[0].promotion_price - a.skus[0].promotion_price
      );
    }

    setFilteredProducts(updatedProducts);
  }, [searchTerm, sortOrder, products]);

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const toggleCategory = (categoryId: string | number) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategory(categoryId);
  };

  const handleSortChange = (value: string) => {
    setSortOrder(value);
    const updatedProducts = [...products];

    switch (value) {
      case "price-asc":
        updatedProducts.sort((a, b) => {
          const priceA = a.skus[0]?.promotion_price > 0 ? a.skus[0].promotion_price : a.skus[0]?.price;
          const priceB = b.skus[0]?.promotion_price > 0 ? b.skus[0].promotion_price : b.skus[0]?.price;
          return (priceA || 0) - (priceB || 0);
        });
        break;
      case "price-desc":
        updatedProducts.sort((a, b) => {
          const priceA = a.skus[0]?.promotion_price > 0 ? a.skus[0].promotion_price : a.skus[0]?.price;
          const priceB = b.skus[0]?.promotion_price > 0 ? b.skus[0].promotion_price : b.skus[0]?.price;
          return (priceB || 0) - (priceA || 0);
        });
        break;
      default:
        break;
    }

    setProducts(updatedProducts);
  };

  const filteredProductsByCategory = selectedCategory
    ? filteredProducts.filter(product =>
        product.categories.some(category => category.id === selectedCategory)
      )
    : filteredProducts;

  const ITEMS_PER_PAGE = 18;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredProductsByCategory.length / ITEMS_PER_PAGE);

  const displayedProducts = filteredProductsByCategory.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const categoriesGroups = categories.reduce((acc: CategoryGroup[], category, index) => {
    if (index % 5 === 0) {
      acc.push({
        id: `group-${Math.floor(index / 5) + 1}`,
        name: `Danh mục ${Math.floor(index / 5) + 1}`,
        subcategories: categories.slice(index, index + 5),
      });
    }
    return acc;
  }, []);

  const Sidebar = () => (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      {/* Categories Section */}
      {/* Danh Mục */}
      <div className="mb-4 border border-[#E2E0DF] rounded-md">
        <div
          className="flex justify-between items-center cursor-pointer p-4 bg-white border-b border-[#E2E0DF]"
          onClick={() => toggleCategory(1)}
        >
          <h3 className="font-medium text-lg">Danh Mục</h3>
          {expandedCategories[1] ? (
            <ChevronUp className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-600" />
          )}
        </div>

        {expandedCategories[1] && (
          <div className="p-4 space-y-2">
            {categoriesGroups.map((group) => (
              <div key={group.id}>
                <div
                  className="flex justify-between items-center cursor-pointer p-2 rounded-md hover:bg-gray-100"
                  onClick={() => toggleCategory(group.id)}
                >
                  <div className="flex items-center gap-2">
                    {group.id === "group-1" && (
                      <svg
                        className="w-4 h-4 text-[#ED0E69]"
                        fill="none"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z"
                        ></path>
                      </svg>
                    )}
                    {group.id === "group-2" && (
                      <svg
                        className="w-4 h-4 text-[#ED0E69]"
                        fill="none"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                        ></path>
                      </svg>
                    )}
                    {group.id === "group-3" && (
                      <svg
                        className="w-4 h-4 text-[#ED0E69]"
                        fill="none"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                        ></path>
                      </svg>
                    )}
                    {group.id === "group-4" && (
                      <svg
                        className="w-4 h-4 text-[#ED0E69]"
                        fill="none"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3"
                        ></path>
                      </svg>
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {group.name}
                    </span>
                  </div>
                  {expandedCategories[group.id] ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </div>

                {expandedCategories[group.id] && (
                  <div className="ml-6 mt-2 space-y-1">
                    {group.subcategories.map((sub) => (
                      <div key={sub.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedCategory === sub.id}
                          onChange={() => handleCategorySelect(sub.id)}
                          className="w-4 h-4 rounded border-gray-300 accent-pink-500 focus:ring-pink-500"
                        />
                        <span className="text-sm text-gray-500">
                          {sub.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white py-4 mb-4 px-[100px] shadow-md">
      <div className="flex items-center gap-4">
        <div className="min-h-screen bg-gray-50 w-full">
          {/* Header with Search and Filter */}
          <FilterSearchHeader
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          <div className="container mx-auto px-4 py-4 sm:py-8">
            {/* Thanh tìm kiếm full width */}
            <div className="w-full mb-6 border-b border-gray-300 pb-4">
              <div className="flex items-center gap-4 ">
                <button className="flex items-center gap-2 border border-pink-500 text-pink-500 py-2 px-4 rounded-lg hover:bg-pink-100 transition">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-sliders-vertical"
                  >
                    <line x1="4" x2="4" y1="21" y2="14" />
                    <line x1="4" x2="4" y1="10" y2="3" />
                    <line x1="12" x2="12" y1="21" y2="12" />
                    <line x1="12" x2="12" y1="8" y2="3" />
                    <line x1="20" x2="20" y1="21" y2="16" />
                    <line x1="20" x2="20" y1="12" y2="3" />
                    <line x1="2" x2="6" y1="14" y2="14" />
                    <line x1="10" x2="14" y1="8" y2="8" />
                    <line x1="18" x2="22" y1="16" y2="16" />
                  </svg>

                  <span className="font-medium">Filter</span>
                  <span className="bg-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                    3
                  </span>
                </button>
                <div className="flex-grow relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm kiếm sản phẩm..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <Search className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
                </div>
                <select
                  className="border border-gray-300 px-2 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  onChange={(e) => handleSortChange(e.target.value)}
                  value={sortOrder}
                >
                  <option value="">Tất cả</option>
                  <option value="Giá từ thấp đến cao">
                    Giá từ thấp đến cao
                  </option>
                  <option value="Giá từ cao đến thấp">
                    Giá từ cao đến thấp
                  </option>
                </select>
              </div>
            </div>

            {/* Layout mới: Sidebar và sản phẩm cùng hàng */}
            <div className="flex gap-6">
              {/* Sidebar bên trái */}
              <div className="w-1/4 hidden lg:block">
                <Sidebar />
              </div>

              {/* Danh sách sản phẩm bên phải */}
              <div className="w-3/4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {displayedProducts.length > 0 ? (
                    displayedProducts.map((item) => (
                      <Link
                        href={`/product/${item.id}`}
                        key={item.id}
                        className="block"
                      >
                        <div className="relative bg-white rounded-lg shadow-md overflow-hidden group p-4">
                          <div className="relative w-full aspect-square mb-4 overflow-hidden">
                            <Image
                              src={item.images?.[0]?.image_url || "/oxy.jpg"}
                              alt={item.name}
                              fill
                              className="object-cover transform transition-transform duration-300 group-hover:scale-110"
                            />
                          </div>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {item.categories.map((tag) => (
                              <span
                                key={tag.id}
                                className="bg-green-100 text-green-600 text-xs font-medium px-2 py-1 rounded-full"
                              >
                                {tag.name}
                              </span>
                            ))}
                          </div>
                          <h3 className="text-sm font-medium mb-2 line-clamp-2 text-gray-900">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500 line-clamp-3">
                            {item.short_description}
                          </p>
                          <div className="mb-4">
                            {item.skus?.[0]?.promotion_price > 0 ? (
                              <>
                                <span className="line-through text-gray-500 text-sm mr-2">
                                  {item.skus?.[0]?.price.toLocaleString()}đ
                                </span>
                                <span className="text-pink-600 font-bold text-lg">
                                  {item.skus?.[0]?.promotion_price.toLocaleString()}đ
                                </span>
                              </>
                            ) : (
                              <span className="text-pink-600 font-bold text-lg">
                                {item.skus?.[0]?.price.toLocaleString()}đ
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-yellow-500 text-sm ml-2">
                              ★ {item.rating ? item.rating.toFixed(1) : "Chưa có"}
                            </span>
                            <button className="bg-pink-600 text-white py-2 px-4 rounded text-sm hover:bg-pink-700">
                              Mua Ngay
                            </button>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center col-span-full">
                      Không tìm thấy sản phẩm nào.
                    </p>
                  )}
                </div>
                <div className="mt-8 flex justify-center">
                  <nav className="flex items-center gap-2">
                    <button
                      className="px-3 py-1 border rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Trước
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          className={`px-3 py-1 rounded-lg ${
                            page === currentPage
                              ? "bg-pink-600 text-white"
                              : "text-gray-500 hover:bg-gray-50"
                          }`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      )
                    )}
                    <button
                      className="px-3 py-1 border rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Sau
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;
