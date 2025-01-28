"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronUp, ChevronDown, Diamond, Filter } from 'lucide-react';

const ProductListingPage = () => {
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

  const handleFilterChange = (type, value) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      if (type === 'categories' || type === 'ratings' || type === 'tags') {
        if (newFilters[type].includes(value)) {
          newFilters[type] = newFilters[type].filter(item => item !== value);
        } else {
          newFilters[type] = [...newFilters[type], value];
        }
      }
      return newFilters;
    });
  };

  const handlePriceChange = (type, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [type]: value
      }
    }));
  };

  const Sidebar = () => (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      {/* Categories Section */}
      <div className="mb-4">
        <div 
          className="flex justify-between items-center mb-2 cursor-pointer"
          onClick={() => toggleCategory('main')}
        >
          <h3 className="font-medium">Danh Mục</h3>
          {expandedCategories.main ? 
            <ChevronUp className="w-4 h-4" /> : 
            <ChevronDown className="w-4 h-4" />
          }
        </div>
        
        {expandedCategories.main && (
          <div className="space-y-2">
            <div>
              <div 
                className="flex items-center gap-2 text-pink-500 mb-2 cursor-pointer"
                onClick={() => toggleCategory('category1')}
              >
                <span className="flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <rect width="16" height="16" rx="4"/>
                  </svg>
                </span>
                <span>Danh mục 1</span>
                {expandedCategories.category1 ? 
                  <ChevronUp className="w-4 h-4 ml-auto" /> : 
                  <ChevronDown className="w-4 h-4 ml-auto" />
                }
              </div>
              
              {expandedCategories.category1 && (
                <div className="ml-6 space-y-2">
                  {[
                    { name: 'Danh mục con 1', count: 574 },
                    { name: 'Danh mục con 2', count: 568 },
                    { name: 'Danh mục con 3', count: 1345 },
                    { name: 'Danh mục con 4', count: 317 },
                    { name: 'Danh mục con 5', count: 31 },
                    { name: 'Danh mục con 6', count: 558 },
                    { name: 'Danh mục con 7', count: 37 }
                  ].map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedFilters.categories.includes(item.name)}
                          onChange={() => handleFilterChange('categories', item.name)}
                          className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500"
                        />
                        <span className="text-sm text-gray-600">{item.name}</span>
                      </div>
                      <span className="text-sm text-gray-400">{item.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {[2, 3, 4, 5].map((num) => (
              <div key={num} className="flex items-center gap-2 cursor-pointer">
                {num === 2 ? (
                  <Diamond className="w-4 h-4" />
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <rect width="16" height="16" rx="4"/>
                  </svg>
                )}
                <span>Danh mục {num}</span>
                <ChevronDown className="w-4 h-4 ml-auto" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rating Section */}
      <div className="mb-4">
        <div 
          className="flex justify-between items-center mb-2 cursor-pointer"
          onClick={() => toggleCategory('ratings')}
        >
          <h3 className="font-medium">Đánh Giá</h3>
          {expandedCategories.ratings ? 
            <ChevronUp className="w-4 h-4" /> : 
            <ChevronDown className="w-4 h-4" />
          }
        </div>
        
        {expandedCategories.ratings && (
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedFilters.ratings.includes(rating.toString())}
                    onChange={() => handleFilterChange('ratings', rating.toString())}
                    className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500"
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
      <div>
        <div 
          className="flex justify-between items-center mb-2 cursor-pointer"
          onClick={() => toggleCategory('price')}
        >
          <h3 className="font-medium">Giá</h3>
          {expandedCategories.price ? 
            <ChevronUp className="w-4 h-4" /> : 
            <ChevronDown className="w-4 h-4" />
          }
        </div>
        
        {expandedCategories.price && (
          <div className="px-2">
            <div className="relative h-1 bg-gray-200 rounded-full">
              <div className="absolute h-1 bg-pink-500 left-1/4 right-1/2" />
              <div className="absolute w-4 h-4 bg-white border-2 border-pink-500 rounded-full -mt-1.5 left-1/4" />
              <div className="absolute w-4 h-4 bg-white border-2 border-pink-500 rounded-full -mt-1.5 right-1/2" />
            </div>
            <div className="flex justify-between mt-4">
              <div className="w-24">
                <input
                  type="text"
                  value={selectedFilters.priceRange.min}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  placeholder="$ min"
                  className="w-full px-2 py-1 text-sm border rounded"
                />
              </div>
              <div className="w-24">
                <input
                  type="text"
                  value={selectedFilters.priceRange.max}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  placeholder="$ max"
                  className="w-full px-2 py-1 text-sm border rounded"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="mt-4">
        <h3 className="font-medium text-gray-700 mb-2">Loại sản phẩm</h3>
        {['Sữa rửa mặt', 'Dưỡng da', 'Kem chống nắng'].map((tag) => (
          <label key={tag} className="flex items-center space-x-2 mb-2">
            <input 
              type="checkbox"
              checked={selectedFilters.tags.includes(tag)}
              onChange={() => handleFilterChange('tags', tag)}
              className="rounded text-pink-600 focus:ring-pink-500"
            />
            <span className="text-gray-600">{tag}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Tất cả sản phẩm</h1>
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="bg-white p-2 rounded-lg shadow-sm flex items-center gap-2"
          >
            <Filter className="w-5 h-5" />
            <span>Lọc</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8">
          {/* Sidebar */}
          <div className={`lg:col-span-3 ${isMobileFilterOpen ? 'block' : 'hidden'} lg:block fixed lg:relative top-0 left-0 w-full lg:w-auto h-full lg:h-auto z-50 bg-gray-50 lg:bg-transparent overflow-auto`}>
            {isMobileFilterOpen && (
              <div className="p-4 bg-white lg:hidden flex justify-between items-center">
                <h2 className="font-bold">Bộ lọc</h2>
                <button onClick={() => setIsMobileFilterOpen(false)} className="text-gray-500">
                  ✕
                </button>
              </div>
            )}
            <div className="p-4 lg:p-0">
              <Sidebar />
            </div>
          </div>

          {/* Product Grid Section */}
          <div className="lg:col-span-9">
            <div className="hidden lg:flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Tất cả sản phẩm</h1>
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="border rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="">Sắp xếp theo</option>
                <option value="price_asc">Giá thấp đến cao</option>
                <option value="price_desc">Giá cao đến thấp</option>
                <option value="rating">Đánh giá cao nhất</option>
              </select>
            </div>

            {/* Mobile Sort */}
            <div className="lg:hidden mb-4">
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="">Sắp xếp theo</option>
                <option value="price_asc">Giá thấp đến cao</option>
                <option value="price_desc">Giá cao đến thấp</option>
                <option value="rating">Đánh giá cao nhất</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="relative bg-white rounded-lg shadow-md overflow-hidden group p-3 sm:p-4">
                  <div className="relative w-full aspect-square mb-3 sm:mb-4 overflow-hidden">
                    <Image
                      src="/oxy.jpg"
                      alt={`Product ${item}`}
                      fill
                      className="object-cover transform transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
                    {['Sữa rửa mặt', 'Dưỡng da'].map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-green-100 text-green-600 text-xs font-medium px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-sm font-medium mb-2 line-clamp-2 text-gray-800">
                    Kem dưỡng da La Roche-Posay Cicaplast Baume B5+ hỗ trợ làm dịu...
                  </h3>

                  <div className="mb-3 sm:mb-4">
                    <span className="line-through text-gray-500 text-sm mr-2">130.000đ</span>
                    <span className="text-pink-600 font-bold text-base sm:text-lg">120.000đ</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm text-gray-600 ml-1">4.9</span>
                    </div>
                    <button className="bg-pink-600 text-white py-1.5 px-3 sm:py-2 sm:px-4 rounded text-sm hover:bg-pink-700 transition-colors">
                      Mua ngay
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination - Optional */}
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center gap-2">
                <button className="px-3 py-1 border rounded-lg text-gray-500 hover:bg-gray-50">
                  Previous
                </button>
                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    className={`px-3 py-1 rounded-lg ${
                      page === 1
                        ? 'bg-pink-600 text-white'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button className="px-3 py-1 border rounded-lg text-gray-500 hover:bg-gray-50">
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Overlay Background */}
      {isMobileFilterOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
          onClick={() => setIsMobileFilterOpen(false)}
        />
      )}
    </div>
  );
};

export default ProductListingPage;