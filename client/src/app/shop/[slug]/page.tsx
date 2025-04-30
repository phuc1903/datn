"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronUp, ChevronDown, Filter, Search } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import ReactSlider from "react-slider";
import { API_BASE_URL } from "@/config/config";

interface Product {
  id: number;
  name: string;
  images: Array<{ image_url: string }>;
  skus: Array<{ price: number; promotion_price: number }>;
  categories: Array<{ id: number; name: string; slug: string }>;
  short_description: string;
  feedbacks_avg_rating: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id: number;
}

const CategoryPage = () => {
  const { slug } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sortOrder, setSortOrder] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
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
    priceRange: { min: any | ""; max: any | "" };
  }>({
    categories: [],
    ratings: [],
    priceRange: { min: "", max: "" },
  });

  // Fetch category-specific products and categories
  useEffect(() => {
    if (!slug) return;

    const fetchCategoryData = async () => {
      try {
        const catResponse = await fetch(`${API_BASE_URL}/categories`);
        const catData = await catResponse.json();
        const allCategories: Category[] = catData.data;

        const category = allCategories.find((cat: Category) => cat.slug === slug);
        if (!category) {
          console.error("Category not found for slug:", slug);
          setLoading(false);
          return;
        }

        setCategoryName(category.name);
        const categoryId = category.id;

        const getAllSubcategoryIds = (parentId: number): number[] => {
          const subCategories = allCategories.filter((cat: Category) => cat.parent_id === parentId);
          let subCategoryIds: number[] = [];
          subCategories.forEach((subCat) => {
            subCategoryIds.push(subCat.id);
            subCategoryIds = subCategoryIds.concat(getAllSubcategoryIds(subCat.id));
          });
          return subCategoryIds;
        };

        const subCategoryIds = getAllSubcategoryIds(categoryId);
        const allCategoryIds = [categoryId, ...subCategoryIds];

        const prodResponse = await fetch(`${API_BASE_URL}/products`);
        const prodData = await prodResponse.json();
        const categoryProducts = prodData.data.filter((product: Product) =>
          product.categories.some((cat) => allCategoryIds.includes(cat.id))
        );
        setProducts(categoryProducts);
        setCategories(allCategories);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [slug]);

  // Combined filtering logic
  useEffect(() => {
    let updatedProducts = [...products];

    if (searchTerm) {
      updatedProducts = updatedProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedFilters.categories.length > 0) {
      updatedProducts = updatedProducts.filter((product) =>
        product.categories.some((category) =>
          selectedFilters.categories.includes(category.id)
        )
      );
    }

    if (selectedFilters.ratings.length > 0) {
      updatedProducts = updatedProducts.filter((product) => {
        const productRating = product.feedbacks_avg_rating;
        return selectedFilters.ratings.some((selectedRating: string) => {
          const minRating = parseInt(selectedRating);
          const maxRating = minRating + 0.9;
          return productRating >= minRating && productRating <= maxRating;
        });
      });
    }

    if (selectedFilters.priceRange.min !== "" || selectedFilters.priceRange.max !== "") {
      updatedProducts = updatedProducts.filter((product) => {
        const price = product.skus[0].promotion_price;
        const minPrice = selectedFilters.priceRange.min ? parseFloat(selectedFilters.priceRange.min as string) : 0;
        const maxPrice = selectedFilters.priceRange.max ? parseFloat(selectedFilters.priceRange.max as string) : Infinity;
        return price >= minPrice && price <= maxPrice;
      });
    }

    if (sortOrder === "Giá từ thấp đến cao") {
      updatedProducts.sort((a, b) => a.skus[0].promotion_price - b.skus[0].promotion_price);
    } else if (sortOrder === "Giá từ cao đến thấp") {
      updatedProducts.sort((a, b) => b.skus[0].promotion_price - a.skus[0].promotion_price);
    }

    setFilteredProducts(updatedProducts);
  }, [
    searchTerm,
    products,
    selectedFilters.categories,
    selectedFilters.ratings,
    selectedFilters.priceRange,
    sortOrder,
  ]);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const handleCategoryChange = (categoryId: number) => {
    setSelectedFilters((prev) => {
      const newCategories = prev.categories.includes(categoryId)
        ? prev.categories.filter((id: number) => id !== categoryId)
        : [...prev.categories, categoryId];
      return { ...prev, categories: newCategories };
    });
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setSelectedFilters((prev) => {
      const updatedFilters = { ...prev };
      if (filterType === "ratings") {
        updatedFilters.ratings = prev.ratings.includes(value)
          ? prev.ratings.filter((rating: string) => rating !== value)
          : [...prev.ratings, value];
      }
      return updatedFilters;
    });
  };

  const handlePriceChange = (type: "min" | "max", value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      priceRange: { ...prev.priceRange, [type]: value ? parseFloat(value) : "" },
    }));
  };

  const MIN_PRICE = 0;
  const MAX_PRICE = 999000;
  const ITEMS_PER_PAGE = 18;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const Sidebar = () => {
    const getSubcategories = (parentId: number) =>
      categories.filter((category: Category) => category.parent_id === parentId);
    const parentCategories = categories.filter(
      (category: Category) => getSubcategories(category.id).length > 0
    );

    return (
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="mb-4 border border-[#E2E0DF] rounded-md">
          <div
            className="flex justify-between items-center cursor-pointer p-4 bg-white border-b border-[#E2E0DF]"
            onClick={() => toggleCategory("main")}
          >
            <h3 className="font-medium text-lg">Danh Mục</h3>
            {expandedCategories.main ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
          {expandedCategories.main && (
            <div className="p-4 space-y-2">
              {parentCategories.map((parent: Category) => (
                <div key={parent.id}>
                  <div
                    className="flex justify-between items-center cursor-pointer p-2 rounded-md hover:bg-gray-100"
                    onClick={() => toggleCategory(parent.id.toString())}
                  >
                    <span className="text-sm font-medium text-gray-700">{parent.name}</span>
                    {expandedCategories[parent.id] ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                  {expandedCategories[parent.id] && (
                    <div className="ml-6 mt-2 space-y-1">
                      {getSubcategories(parent.id).map((sub: Category) => (
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

        <div className="mb-4 border border-[#E2E0DF]">
          <div
            className="flex justify-between items-center cursor-pointer p-5 border border-[#E2E0DF]"
            onClick={() => toggleCategory("ratings")}
          >
            <h3 className="font-medium text-lg">Đánh Giá</h3>
            {expandedCategories.ratings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
          {expandedCategories.ratings && (
            <div className="space-y-2 p-5">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedFilters.ratings.includes(rating.toString())}
                      onChange={() => handleFilterChange("ratings", rating.toString())}
                      className="w-4 h-4 rounded border-gray-300 accent-pink-500 focus:ring-pink-500"
                    />
                    <div className="flex items-center">
                      <span className="text-sm mr-1">{rating}</span>
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm ml-1">& lên</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border border-[#E2E0DF] p-5">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleCategory("price")}
          >
            <h3 className="font-medium text-lg">Giá</h3>
            {expandedCategories.price ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
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
                  selectedFilters.priceRange.min === "" ? MIN_PRICE : Number(selectedFilters.priceRange.min),
                  selectedFilters.priceRange.max === "" ? MAX_PRICE : Number(selectedFilters.priceRange.max),
                ]}
                onChange={([min, max]: [number, number]) =>
                  setSelectedFilters((prev) => ({ ...prev, priceRange: { min, max } }))
                }
              />
              <div className="flex justify-between mt-4">
                <input
                  type="number"
                  value={selectedFilters.priceRange.min === "" ? "" : (selectedFilters.priceRange.min as unknown as string)}
                  onChange={(e) => handlePriceChange("min", e.target.value)}
                  placeholder="Giá tối thiểu"
                  className="w-24 px-2 py-1 text-sm border rounded"
                />
                <input
                  type="number"
                  value={selectedFilters.priceRange.max === "" ? "" : (selectedFilters.priceRange.max as unknown as string)}
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

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="bg-white py-4 mb-4 px-[100px] shadow-md">
      <h1 className="text-2xl font-bold mb-4">{categoryName}</h1>
      <div className="flex items-center gap-4">
        <div className="min-h-screen bg-gray-50 w-full">
          <div className="container mx-auto px-4 py-4 sm:py-8">
            <div className="w-full mb-6 border-b border-gray-300 pb-4">
              <div className="flex items-center gap-4">
                <button
                  className="flex items-center gap-2 border border-pink-500 text-pink-500 py-2 px-4 rounded-lg hover:bg-pink-100 transition"
                  onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                >
                  <Filter className="w-5 h-5" />
                  <span className="font-medium">Lọc</span>
                </button>
                <div className="flex-grow relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm kiếm sản phẩm trong danh mục..."
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
            </div>

            <div className="flex gap-6">
              <div className="w-1/4 hidden lg:block">
                <Sidebar />
              </div>
              <div className="w-3/4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {displayedProducts.length > 0 ? (
                    displayedProducts.map((item: Product) => (
                      <Link href={`/product/${item.id}`} key={item.id} className="block">
                        <div className="relative bg-white rounded-lg shadow-md overflow-hidden group p-4">
                          <div className="relative w-full aspect-square mb-4 overflow-hidden">
                            <Image
                              src={item.images?.[0]?.image_url || "/oxy.jpg"}
                              alt={item.name}
                              fill
                              className="object-cover transform transition-transform duration-300 group-hover:scale-110"
                            />
                          </div>
                          <h3 className="text-sm font-medium mb-2 line-clamp-2 text-gray-900">{item.name}</h3>
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
                              Mua Ngay
                            </button>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center col-span-full">
                      Không tìm thấy sản phẩm nào trong danh mục này.
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
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        className={`px-3 py-1 rounded-lg ${
                          page === currentPage ? "bg-pink-600 text-white" : "text-gray-500 hover:bg-gray-50"
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

export default CategoryPage;