"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronUp, ChevronDown, Search } from "lucide-react";
import Link from "next/link";
import { API_BASE_URL } from "@/config/config";
import ReactSlider from "react-slider";

// Define types
interface Category {
  id: number;
  name: string;
  parent_id?: number;
}

interface Sku {
  price: number;
  promotion_price: number;
}

interface Product {
  id: number;
  name: string;
  short_description?: string;
  images?: { image_url: string }[];
  categories: Category[];
  skus: Sku[];
  feedbacks_avg_rating?: number;
}

const ProductListingPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sortOrder, setSortOrder] = useState<string>("");

  // Fetch products from API
  useEffect(() => {
    fetch(`${API_BASE_URL}/products`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Dữ liệu sản phẩm:", data.data);
        setProducts(data.data);
        setFilteredProducts(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu:", error);
        setLoading(false);
      });
  }, []);

  // Filter products by search term
  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  // Fetch categories from API
  useEffect(() => {
    fetch(`${API_BASE_URL}/categories`)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu:", error);
        setLoading(false);
      });
  }, []);

  // Sort products by price
  useEffect(() => {
    let updatedProducts = [...products].filter((item) =>
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

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [expandedCategories, setExpandedCategories] = useState<{
    main: boolean;
    ratings: boolean;
    price: boolean;
    [key: string]: boolean;
  }>({
    main: true,
    ratings: true,
    price: true,
  });

  const [selectedFilters, setSelectedFilters] = useState<{
    categories: number[];
    ratings: string[];
    priceRange: { min: number | ""; max: number | "" };
    tags: string[];
  }>({
    categories: [],
    ratings: [],
    priceRange: { min: "", max: "" },
    tags: [],
  });

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Handle category filter change
  const handleCategoryChange = (categoryId: number) => {
    setSelectedFilters((prev) => {
      const newCategories = prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId];
      return { ...prev, categories: newCategories };
    });
  };

  // Filter products by selected categories
  useEffect(() => {
    if (selectedFilters.categories.length === 0) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter((product) =>
      product.categories.some((category) =>
        selectedFilters.categories.includes(category.id)
      )
    );
    setFilteredProducts(filtered.length > 0 ? filtered : products);
  }, [selectedFilters.categories, products]);

  // Handle filter changes (e.g., ratings)
  const handleFilterChange = (filterType: string, value: string) => {
    setSelectedFilters((prev) => {
      const updatedFilters = { ...prev };
      if (filterType === "ratings") {
        updatedFilters.ratings = prev.ratings.includes(value)
          ? prev.ratings.filter((rating) => rating !== value)
          : [...prev.ratings, value];
      }
      return updatedFilters;
    });
  };

  // Filter products by ratings
  useEffect(() => {
    let updatedProducts = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedFilters.ratings.length > 0) {
      updatedProducts = updatedProducts.filter((product) => {
        const productRating = product.feedbacks_avg_rating || 0;
        return selectedFilters.ratings.some((selectedRating) => {
          const minRating = parseInt(selectedRating);
          const maxRating = minRating + 0.9;
          return productRating >= minRating && productRating <= maxRating;
        });
      });
    }

    setFilteredProducts(updatedProducts);
  }, [selectedFilters.ratings, searchTerm, products]);

  // Handle price range change
  const handlePriceChange = (
    type: "min" | "max",
    value: string | number
  ) => {
    setSelectedFilters((prev) => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [type]: value === "" ? "" : parseFloat(value as string),
      },
    }));
  };

  // Filter products by price range
  useEffect(() => {
    let updatedProducts = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (
      selectedFilters.priceRange.min !== "" ||
      selectedFilters.priceRange.max !== ""
    ) {
      updatedProducts = updatedProducts.filter((product) => {
        const price = product.skus[0].promotion_price;
        const minPrice =
          selectedFilters.priceRange.min === ""
            ? 0
            : Number(selectedFilters.priceRange.min);
        const maxPrice =
          selectedFilters.priceRange.max === ""
            ? Infinity
            : Number(selectedFilters.priceRange.max);
        return price >= minPrice && price <= maxPrice;
      });
    }

    setFilteredProducts(updatedProducts);
  }, [selectedFilters.priceRange, searchTerm, products]);

  const MIN_PRICE = 0;
  const MAX_PRICE = 999000;

  const ITEMS_PER_PAGE = 18;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Sidebar Component
  const Sidebar = () => {
    const getSubcategories = (parentId: number) =>
      categories.filter((category) => category.parent_id === parentId);

    const parentCategories = categories.filter(
      (category) => getSubcategories(category.id).length > 0
    );

    return (
      <div className="bg-white p-4 rounded-lg shadow-sm">
        {/* Categories */}
        <div className="mb-4 border border-[#E2E0DF] rounded-md">
          <div
            className="flex justify-between items-center cursor-pointer p-4 bg-white border-b border-[#E2E0DF]"
            onClick={() => toggleCategory("main")}
          >
            <h3 className="font-medium text-lg">Danh Mục</h3>
            {expandedCategories.main ? (
              <ChevronUp className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            )}
          </div>
          {expandedCategories.main && (
            <div className="p-4 space-y-2">
              {parentCategories.map((parent) => (
                <div key={parent.id}>
                  <div
                    className="flex justify-between items-center cursor-pointer p-2 rounded-md hover:bg-gray-100"
                    onClick={() => toggleCategory(String(parent.id))}
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {parent.name}
                    </span>
                    {expandedCategories[parent.id] ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                  {expandedCategories[parent.id] && (
                    <div className="ml-6 mt-2 space-y-1">
                      {getSubcategories(parent.id).map((sub) => (
                        <div key={sub.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedFilters.categories.includes(
                              sub.id
                            )}
                            onChange={() => handleCategoryChange(sub.id)}
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

        {/* Ratings */}
        <div className="mb-4 border border-[#E2E0DF]">
          <div
            className="flex justify-between items-center cursor-pointer p-5 border border-[#E2E0DF]"
            onClick={() => toggleCategory("ratings")}
          >
            <h3 className="font-medium text-lg">Đánh Giá</h3>
            {expandedCategories.ratings ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
          {expandedCategories.ratings && (
            <div className="space-y-2 p-5">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div
                  key={rating}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedFilters.ratings.includes(
                        rating.toString()
                      )}
                      onChange={() =>
                        handleFilterChange("ratings", rating.toString())
                      }
                      className="w-4 h-4 rounded border-gray-300 accent-pink-500 focus:ring-pink-500"
                    />
                    <div className="flex items-center">
                      <span className="text-sm mr-1">{rating}</span>
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm ml-1">& lên</span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">1345</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Price Range */}
        <div className="border border-[#E2E0DF] p-5">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleCategory("price")}
          >
            <h3 className="font-medium text-lg">Giá</h3>
            {expandedCategories.price ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
          {expandedCategories.price && (
            <div className="px-2 mt-4">
              <ReactSlider
                className="w-full h-2 bg-gray-200 rounded-full relative"
                thumbClassName="w-5 h-5 bg-white rounded-full cursor-pointer focus:outline-none border-2 border-pink-500 shadow-md transform translate-y-[-50%] top-1/2"
                trackClassName="h-2 rounded-full"
                renderTrack={(props, state) => {
                  const { key, ...restProps } = props;
                  const backgroundColor =
                    state.index === 1 ? "bg-pink-500" : "bg-white";
                  return (
                    <div
                      key={key}
                      {...restProps}
                      className={`h-2 rounded-full ${backgroundColor}`}
                    />
                  );
                }}
                min={MIN_PRICE}
                max={MAX_PRICE}
                value={[
                  selectedFilters.priceRange.min === ""
                    ? MIN_PRICE
                    : Number(selectedFilters.priceRange.min),
                  selectedFilters.priceRange.max === ""
                    ? MAX_PRICE
                    : Number(selectedFilters.priceRange.max),
                ]}
                onChange={([min, max]: [number, number]) => {
                  setSelectedFilters((prev) => ({
                    ...prev,
                    priceRange: { min, max },
                  }));
                }}
              />
              <div className="flex justify-between mt-4">
                <input
                  type="number"
                  value={selectedFilters.priceRange.min}
                  onChange={(e) => handlePriceChange("min", e.target.value)}
                  placeholder="Giá tối thiểu"
                  className="w-24 px-2 py-1 text-sm border rounded"
                />
                <input
                  type="number"
                  value={selectedFilters.priceRange.max}
                  onChange={(e) => handlePriceChange("max", e.target.value)}
                  placeholder="Giá tối đa"
                  className="w-24 px-2 py-1 text-sm border rounded"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // FilterSearchHeader Component
  const FilterSearchHeader = ({
    searchTerm,
    setSearchTerm,
  }: {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
  }) => {
    return (
      <div className="lg:hidden mb-4">
        <button
          className="w-full flex items-center justify-center gap-2 bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 transition"
          onClick={() => setIsMobileFilterOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 -ish24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
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
          <span className="font-medium">Bộ lọc</span>
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white py-4 mb-4 px-4 sm:px-[100px] shadow-md">
      <div className="flex items-center gap-4">
        <div className="min-h-screen bg-gray-50 w-full">
          <FilterSearchHeader
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          <div className="container mx-auto px-4 py-4 sm:py-8">
            {/* Mobile Filter Modal */}
            {isMobileFilterOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
                <div className="absolute top-0 left-0 w-3/4 bg-white h-full p-4 overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Bộ lọc</h2>
                    <button
                      className="text-gray-600"
                      onClick={() => setIsMobileFilterOpen(false)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <Sidebar />
                  <button
                    className="w-full bg-pink-500 text-white py-2 rounded-lg mt-4"
                    onClick={() => setIsMobileFilterOpen(false)}
                  >
                    Áp dụng
                  </button>
                </div>
              </div>
            )}

            {/* Search and Filter Bar */}
            <div className="w-full mb-6 border-b border-gray-300 pb-4">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                <button
                  className="lg:hidden flex items-center gap-2 border border-pink-500 text-pink-500 py-2 px-4 rounded-lg hover:bg-pink-100 transition w-full sm:w-auto"
                  onClick={() => setIsMobileFilterOpen(true)}
                >
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
                  <span className="font-medium">Lọc</span>
                  <span className="bg-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                    3
                  </span>
                </button>
                <div className="flex-grow relative w-full">
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
                  className="border border-gray-300 px-2 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 w-full sm:w-auto"
                  onChange={(e) => setSortOrder(e.target.value)}
                  value={sortOrder}
                >
                  <option value="">Tất cả</option>
                  <option value="Giá từ thấp đến cao">Giá từ thấp đến cao</option>
                  <option value="Giá từ cao đến thấp">Giá từ cao đến thấp</option>
                </select>
              </div>
            </div>

            {/* Layout: Sidebar and Products */}
            <div className="flex gap-6">
              <div className="w-1/4 hidden lg:block">
                <Sidebar />
              </div>
              <div className="w-full lg:w-3/4">
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
                              ★{" "}
                              {item.feedbacks_avg_rating
                                ? Number(item.feedbacks_avg_rating).toFixed(1)
                                : "0"}
                            </span>
                            <button className="bg-pink-600 text-white py-2 px-4 rounded text-sm hover:bg-pink-700">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                              </svg>
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
                          className={`px-3 py-1 rounded-lg ${page === currentPage
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