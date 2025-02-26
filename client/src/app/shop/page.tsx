"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronUp, ChevronDown, Diamond, Filter, Search  } from 'lucide-react';
import Link from 'next/link';
import { API_BASE_URL } from '@/config/config';
import ReactSlider from "react-slider";



const ProductListingPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState("");
  const FilterSearchHeader = ({ searchTerm, setSearchTerm }) => {
    return (
      <div>

      </div>
    );
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.data);
        setFilteredProducts(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/categories`)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let updatedProducts = products.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortOrder === "Giá từ thấp đến cao") {
      updatedProducts.sort((a, b) => a.skus[0].promotion_price - b.skus[0].promotion_price);
    } else if (sortOrder === "Giá từ cao đến thấp") {
      updatedProducts.sort((a, b) => b.skus[0].promotion_price - a.skus[0].promotion_price);
    }

    setFilteredProducts(updatedProducts);
  }, [searchTerm, sortOrder, products]);



  console.log(categories);

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({
    main: true,
    category1: true,
    ratings: true,
    price: true
  });

  const [selectedFilters, setSelectedFilters] = useState({
    categories: ['Danh mục con 3'],
    ratings: ['3'],
    priceRange: { min: '', max: '' },
    tags: []
  });

  const [sortOption, setSortOption] = useState('');

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/categories`)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setLoading(false);
      });
  }, []);
  
  const handleCategoryChange = (categoryId) => {
    setSelectedFilters((prev) => {
      const newCategories = prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId];
  
      return { ...prev, categories: newCategories };
    });
  };
  
  useEffect(() => {
    if (selectedFilters.categories.length === 0) {
      setFilteredProducts(products);
      return;
    }
  
    const filtered = products.filter((product) =>
      product.categories && product.categories.some((category) =>
        selectedFilters.categories.includes(category.id)
      )
    );
  
    setFilteredProducts(filtered.length > 0 ? filtered : products);
  }, [selectedFilters.categories, products]);

  const categoriesData = Array.from({ length: 50 }, (_, i) => ({
    id: `cate-${i + 1}`,
    name: `Danh mục ${i + 1}`,
    subcategories: []
  }));
  
  const groupedCategories = categoriesData.reduce((acc, category, index) => {
    const groupIndex = Math.floor(index / 10);
    if (!acc[groupIndex]) acc[groupIndex] = { id: `group-${groupIndex + 1}`, name: `Danh mục ${groupIndex + 1}`, subcategories: [] };
    acc[groupIndex].subcategories.push(category);
    return acc;
  }, []);

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters((prev) => {
      const updatedFilters = { ...prev };
  
      if (filterType === 'ratings') {
        updatedFilters.ratings = prev.ratings.includes(value)
          ? prev.ratings.filter((rating) => rating !== value)
          : [...prev.ratings, value];
      }
  
      return updatedFilters;
    });
  };
  
  useEffect(() => {
    let updatedProducts = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    if (selectedFilters.ratings.length > 0) {
      updatedProducts = updatedProducts.filter((product) => {
        const productRating = product.rating; // Giả sử mỗi sản phẩm có thuộc tính rating
        return selectedFilters.ratings.some((selectedRating) => {
          const minRating = parseInt(selectedRating);
          const maxRating = minRating + 0.9;
          return productRating >= minRating && productRating <= maxRating;
        });
      });
    }
  
    setFilteredProducts(updatedProducts);
  }, [selectedFilters.ratings, searchTerm, products]);
  
  const handlePriceChange = (type, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [type]: value ? parseFloat(value) : "", // Chuyển đổi sang số, nếu không nhập thì để rỗng
      },
    }));
  };
  
  useEffect(() => {
    let updatedProducts = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    if (selectedFilters.priceRange.min !== "" || selectedFilters.priceRange.max !== "") {
      updatedProducts = updatedProducts.filter((product) => {
        const price = product.skus[0].promotion_price;
        const minPrice = selectedFilters.priceRange.min ? parseFloat(selectedFilters.priceRange.min) : 0;
        const maxPrice = selectedFilters.priceRange.max ? parseFloat(selectedFilters.priceRange.max) : Infinity;
        return price >= minPrice && price <= maxPrice;
      });
    }
  
    setFilteredProducts(updatedProducts);
  }, [selectedFilters.priceRange, searchTerm, products]);

  const MIN_PRICE = 0;  // Giá thấp nhất, có thể thay đổi theo nhu cầu
const MAX_PRICE = 999000; // Giá cao nhất

const ITEMS_PER_PAGE = 18;
const [currentPage, setCurrentPage] = useState(1);
const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

const displayedProducts = filteredProducts.slice(
  (currentPage - 1) * ITEMS_PER_PAGE,
  currentPage * ITEMS_PER_PAGE
);

const handlePageChange = (page) => {
  if (page >= 1 && page <= totalPages) {
    setCurrentPage(page);
  }
};

  const Sidebar = () => (
    <div className="bg-white p-4 rounded-lg shadow-sm">
{/* Categories Section */} 
<div className="mb-4 border border-[#E2E0DF]">
  <div 
    className="flex justify-between items-center cursor-pointer p-5 border border-[#E2E0DF]"
    onClick={() => toggleCategory('main')}
  >
    <h3 className="font-medium text-lg">Danh Mục</h3>
    {expandedCategories.main ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />
    }
  </div>
  
  {expandedCategories.main && (
    <div className="space-y-2 p-5">
      {categories.map((category) => (
        <div key={category.id}>
          <div className="flex justify-between items-center cursor-pointer p-2 border-b border-gray-200" 
               onClick={() => toggleCategory(category.id)}>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedFilters.categories.includes(category.id)}
                onChange={() => handleCategoryChange(category.id)}
                className="w-4 h-4 rounded border-gray-300 accent-pink-500 focus:ring-pink-500"
              />
              <span className="text-sm text-gray-600">{category.name}</span>
            </div>
            {category.subcategories && category.subcategories.length > 0 && (
              expandedCategories[category.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
            )}
          </div>
          {expandedCategories[category.id] && category.subcategories && (
            <div className="ml-6 mt-2 space-y-1">
              {category.subcategories.map((sub) => (
                <div key={sub.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedFilters.categories.includes(sub.id)}
                    onChange={() => handleCategoryChange(sub.id)}
                    className="w-4 h-4 rounded border-gray-300 accent-pink-500 focus:ring-pink-500"
                  />
                  <span className="text-sm text-gray-500">{sub.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )}
</div>


      {/* Rating Section */}
      <div className="mb-4 border border-[#E2E0DF]">
        <div 
          className="flex justify-between items-center cursor-pointer p-5 border border-[#E2E0DF]"
          onClick={() => toggleCategory('ratings')}
        >
          <h3 className="font-medium  text-lg">Đánh Giá</h3>
          {expandedCategories.ratings ? 
            <ChevronUp className="w-4 h-4" /> : 
            <ChevronDown className="w-4 h-4" />
          }
        </div>
        
        {expandedCategories.ratings && (
          <div className="space-y-2 p-5">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedFilters.ratings.includes(rating.toString())}
                    onChange={() => handleFilterChange('ratings', rating.toString())}
                    className="w-4 h-4 rounded border-gray-300 accent-pink-500 focus:ring-pink-500"
                  />
                  <div className="flex items-center">
                    <span className="text-sm mr-1">{rating}</span>
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm ml-1">& up</span>
                  </div>
                </div>
                <span className="text-sm text-gray-400">1345</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Section */}
      <div className='border border-[#E2E0DF] p-5'>
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => toggleCategory('price')}
      >
        <h3 className="font-medium text-lg">Giá</h3>
        {expandedCategories.price ? 
          <ChevronUp className="w-4 h-4" /> : 
          <ChevronDown className="w-4 h-4" />
        }
      </div>
      
      {expandedCategories.price && (
        <div className="px-2 mt-4">
          <ReactSlider
            className="w-full h-2 bg-gray-200 rounded-full"
            thumbClassName="w-4 h-4 bg-pink-500 rounded-full cursor-pointer"
            trackClassName="bg-pink-500 h-2 rounded-full"
            min={MIN_PRICE}
            max={MAX_PRICE}
            value={[selectedFilters.priceRange.min || MIN_PRICE, selectedFilters.priceRange.max || MAX_PRICE]}
            onChange={([min, max]) => {
              setSelectedFilters((prev) => ({
                ...prev,
                priceRange: { min, max }
              }));
            }}
          />
          <div className="flex justify-between mt-4">
            <input
              type="number"
              value={selectedFilters.priceRange.min}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              placeholder="$ min"
              className="w-24 px-2 py-1 text-sm border rounded"
            />
            <input
              type="number"
              value={selectedFilters.priceRange.max}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              placeholder="$ max"
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
    <div className="min-h-screen bg-gray-50">
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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sliders-vertical">
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
            <span className="bg-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded">3</span>
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
      <option value="Giá từ thấp đến cao">Giá từ thấp đến cao</option>
      <option value="Giá từ cao đến thấp">Giá từ cao đến thấp</option>
    </select>
  </div>
       <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
          <div>
            Gợi ý:{" "}
            <span className="text-pink-500 cursor-pointer hover:underline">user interface</span>,{" "}
            <span className="text-pink-500 cursor-pointer hover:underline">user experience</span>,{" "}
            <span className="text-pink-500 cursor-pointer hover:underline">web design</span>,{" "}
            <span className="text-pink-500 cursor-pointer hover:underline">interface</span>,{" "}
            <span className="text-pink-500 cursor-pointer hover:underline">app</span>
          </div>
          <div className="text-gray-600 font-medium">
            <strong>3,145,684</strong> results find for <span className="italic">"ui/ux design"</span>
          </div>
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
          <div key={item.id} className="relative bg-white rounded-lg shadow-md overflow-hidden group p-3 sm:p-4">
            <div className="relative w-full aspect-square mb-3 sm:mb-4 overflow-hidden">
              <Link href={`/product/${item.id}`}>
                <Image
                  src="/nhuong-quyen-gia-cong-my-pham-blog-coanmy.webp"
                  alt={`Product ${item.name}`}
                  fill
                  className="object-cover transform transition-transform duration-300 group-hover:scale-110"
                />
              </Link>
            </div>
            <h3 className="text-sm font-medium mb-2 line-clamp-2 text-gray-800">{item.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-3">{item.short_description}</p>
            <div className="mb-3 sm:mb-4 my-[10px]">
              <span className="line-through text-gray-500 text-sm mr-2">
                {item.skus[0].price.toLocaleString("vi-VN")}đ
              </span>
              <span className="text-pink-600 font-bold text-base sm:text-lg">
                {item.skus[0].promotion_price.toLocaleString("vi-VN")}đ
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-yellow-400">★</span>
                <span className="text-sm text-gray-600 ml-1">
                {item.rating ? item.rating.toFixed(1) : "Chưa có"} {/* Lấy rating từ API, nếu không có thì hiển thị "Chưa có" */}
                </span>
              </div>
              <button className="bg-pink-600 text-white py-1.5 px-3 sm:py-2 sm:px-4 rounded text-sm hover:bg-pink-700 transition-colors">
                Mua ngay
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center col-span-full">Không tìm thấy sản phẩm nào.</p>
      )}
    </div>

    {/* <div key={item.id} className="relative bg-white rounded-lg shadow-md overflow-hidden group p-3 sm:p-4">
            <div className="relative w-full aspect-square mb-3 sm:mb-4 overflow-hidden">
              <Link href={/product/${item.id}}>
                <Image
                  src="/nhuong-quyen-gia-cong-my-pham-blog-coanmy.webp"
                  alt={Product ${item.name}}
                  fill
                  className="object-cover transform transition-transform duration-300 group-hover:scale-110"
                />
              </Link>
            </div>
            <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
              {item.categories?.map((cate) => (
                <span key={cate.id} className="bg-green-100 text-green-600 text-xs font-medium px-2 py-1 rounded-full">
                  {cate.name}
                </span>
              ))}
            </div>
            <h3 className="text-sm font-medium mb-2 line-clamp-2 text-gray-800">{item.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-3">{item.short_description}</p>
            <div className="mb-3 sm:mb-4 my-[10px]">
              <span className="line-through text-gray-500 text-sm mr-2">
                {item.skus[0].price.toLocaleString("vi-VN")}đ
              </span>
              <span className="text-pink-600 font-bold text-base sm:text-lg">
                {item.skus[0].promotion_price.toLocaleString("vi-VN")}đ
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-yellow-400">★</span>
                <span className="text-sm text-gray-600 ml-1">
                {item.rating ? item.rating.toFixed(1) : "Chưa có"} {/* Lấy rating từ API, nếu không có thì hiển thị "Chưa có" */}
              {/* </span>
              </div>
              <button className="bg-pink-600 text-white py-1.5 px-3 sm:py-2 sm:px-4 rounded text-sm hover:bg-pink-700 transition-colors">
                Mua ngay
              </button>
            </div>
          </div> */}
        {/* ))
      ) : (
        <p className="text-gray-500 text-center col-span-full">Không tìm thấy sản phẩm nào.</p>
      )}
    </div>  */}

    <div className="mt-8 flex justify-center">
      <nav className="flex items-center gap-2">
        <button
          className="px-3 py-1 border rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
        ))}
        <button
          className="px-3 py-1 border rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </nav>
    </div>

  </div>
</div>
{/* <div className="mt-8 flex justify-center">
  <nav className="flex items-center gap-2">
    <button
      className="px-3 py-1 border rounded-lg text-gray-500 hover:bg-gray-50"
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    >
      Previous
    </button>
    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
      <button
        key={page}
        className={`px-3 py-1 rounded-lg ${
          page === currentPage
            ? "bg-pink-600 text-white"
            : "text-gray-500 hover:bg-gray-50"
        }`}
        onClick={() => setCurrentPage(page)}
      >
        {page}
      </button>
    ))}
    <button
      className="px-3 py-1 border rounded-lg text-gray-500 hover:bg-gray-50"
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
    >
      Next
    </button>
  </nav>
</div>
{isMobileFilterOpen && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
    onClick={() => setIsMobileFilterOpen(false)}
  />
)} */}




            {/* Pagination - Optional */}
            {/* <div className="mt-8 flex justify-center">
              <nav className="flex items-center gap-2">
                <button className="px-3 py-1 border rounded-lg text-gray-500 hover:bg-gray-50">
                  Previous
                </button>
                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    className={`px-3 py-1 rounded-lg ${
                      page === 1
                        ? "bg-pink-600 text-white"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button className="px-3 py-1 border rounded-lg text-gray-500 hover:bg-gray-50">
                  Next
                </button>
              </nav>
            </div> */}
          </div>
        </div>
      </div>

      {/* Mobile Filter Overlay Background */}
      {/* {isMobileFilterOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
          onClick={() => setIsMobileFilterOpen(false)}
        />
      )} */}
    </div>
  );
};

export default ProductListingPage;