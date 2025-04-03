"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronUp, ChevronDown, Diamond, Filter, Search } from "lucide-react";
import Link from "next/link";
import { API_BASE_URL } from "@/config/config";
import ReactSlider from "react-slider";

const ProductListingPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState("");

  // Thành phần tiêu đề tìm kiếm và lọc
  const FilterSearchHeader = ({ searchTerm, setSearchTerm }) => {
    return <div></div>;
  };

  // Lấy dữ liệu sản phẩm từ API
  useEffect(() => {
    fetch(`${API_BASE_URL}/products`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Dữ liệu sản phẩm:", data.data); // Kiểm tra dữ liệu
        setProducts(data.data);
        setFilteredProducts(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu:", error);
        setLoading(false);
      });
  }, []);

  // Lọc sản phẩm theo từ khóa tìm kiếm
  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  // Lấy danh sách danh mục từ API
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

  // Sắp xếp sản phẩm theo giá
  useEffect(() => {
    let updatedProducts = products.filter((item) =>
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
  const [expandedCategories, setExpandedCategories] = useState({
    main: true,
    category1: true,
    ratings: true,
    price: true,
  });

  const [selectedFilters, setSelectedFilters] = useState({
    categories: ["Danh mục con 3"],
    ratings: ["3"],
    priceRange: { min: "", max: "" },
    tags: [],
  });

  const [sortOption, setSortOption] = useState("");

  // Chuyển đổi trạng thái mở/rút gọn danh mục
  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Lấy danh mục từ API
  useEffect(() => {
    fetch(`${API_BASE_URL}/categories`)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh mục:", error);
        setLoading(false);
      });
  }, []);

  // Xử lý thay đổi danh mục được chọn
  const handleCategoryChange = (categoryId) => {
    setSelectedFilters((prev) => {
      const newCategories = prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId];

      return { ...prev, categories: newCategories };
    });
  };

  // Lọc sản phẩm theo danh mục
  useEffect(() => {
    if (selectedFilters.categories.length === 0) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(
      (product) =>
        product.categories &&
        product.categories.some((category) =>
          selectedFilters.categories.includes(category.id)
        )
    );

    setFilteredProducts(filtered.length > 0 ? filtered : products);
  }, [selectedFilters.categories, products]);

  // Dữ liệu giả lập danh mục
  const categoriesData = Array.from({ length: 50 }, (_, i) => ({
    id: `cate-${i + 1}`,
    name: `Danh mục ${i + 1}`,
    subcategories: [],
  }));

  const groupedCategories = categoriesData.reduce((acc, category, index) => {
    const groupIndex = Math.floor(index / 10);
    if (!acc[groupIndex])
      acc[groupIndex] = {
        id: `group-${groupIndex + 1}`,
        name: `Danh mục ${groupIndex + 1}`,
        subcategories: [],
      };
    acc[groupIndex].subcategories.push(category);
    return acc;
  }, []);

  // Xử lý thay đổi bộ lọc
  const handleFilterChange = (filterType, value) => {
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

  // Lọc sản phẩm theo đánh giá
  useEffect(() => {
    let updatedProducts = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedFilters.ratings.length > 0) {
      updatedProducts = updatedProducts.filter((product) => {
        const productRating = product.feedbacks_avg_rating;
        return selectedFilters.ratings.some((selectedRating) => {
          const minRating = parseInt(selectedRating);
          const maxRating = minRating + 0.9;
          return productRating >= minRating && productRating <= maxRating;
        });
      });
    }

    setFilteredProducts(updatedProducts);
  }, [selectedFilters.ratings, searchTerm, products]);

  // Xử lý thay đổi khoảng giá
  const handlePriceChange = (type, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [type]: value ? parseFloat(value) : "",
      },
    }));
  };

  // Lọc sản phẩm theo giá
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
        const minPrice = selectedFilters.priceRange.min
          ? parseFloat(selectedFilters.priceRange.min)
          : 0;
        const maxPrice = selectedFilters.priceRange.max
          ? parseFloat(selectedFilters.priceRange.max)
          : Infinity;
        return price >= minPrice && price <= maxPrice;
      });
    }

    setFilteredProducts(updatedProducts);
  }, [selectedFilters.priceRange, searchTerm, products]);

  const MIN_PRICE = 0; // Giá thấp nhất
  const MAX_PRICE = 999000; // Giá cao nhất

  const ITEMS_PER_PAGE = 18; // Số sản phẩm mỗi trang
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Xử lý thay đổi trang
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Thành phần Sidebar
  const Sidebar = () => (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      {/* Phần Danh Mục */}
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
            {categories
              .reduce((acc, category, index) => {
                if (index % 5 === 0) {
                  acc.push({
                    id: `group-${Math.floor(index / 5) + 1}`,
                    name: `Danh mục ${Math.floor(index / 5) + 1}`,
                    subcategories: categories.slice(index, index + 5),
                  });
                }
                return acc;
              }, [])
              .map((group) => (
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

      {/* Phần Đánh Giá */}
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
              <div key={rating} className="flex items-center justify-between">
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

      {/* Phần Khoảng Giá */}
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
              className="w-full h-2 bg-gray-200 rounded-full"
              thumbClassName="w-4 h-4 bg-pink-500 rounded-full cursor-pointer"
              trackClassName="bg-pink-500 h-2 rounded-full"
              min={MIN_PRICE}
              max={MAX_PRICE}
              value={[
                selectedFilters.priceRange.min || MIN_PRICE,
                selectedFilters.priceRange.max || MAX_PRICE,
              ]}
              onChange={([min, max]) => {
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

  return (
    <div className="bg-white py-4 mb-4 px-[100px] shadow-md">
      <div className="flex items-center gap-4">
        <div className="min-h-screen bg-gray-50 w-full">
          {/* Tiêu đề với Tìm kiếm và Lọc */}
          <FilterSearchHeader
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          <div className="container mx-auto px-4 py-4 sm:py-8">
            {/* Thanh tìm kiếm toàn chiều rộng */}
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

                  <span className="font-medium">Lọc</span>
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
                  onChange={(e) => setSortOrder(e.target.value)}
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

            {/* Bố cục mới: Sidebar và sản phẩm cùng hàng */}
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
                                {tag.name} {/* Chỉ hiển thị tên danh mục */}
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
                                  {item.skus?.[0]?.promotion_price.toLocaleString()}
                                  đ
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