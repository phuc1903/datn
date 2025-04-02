"use client"
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingBag, User, Heart, ChevronDown, Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from "@/config/config";

interface Category {
  id: number;
  name: string;
  short_description: string;
  parent_id: number;
  slug: string;
}

interface ProcessedCategory {
  id: number;
  name: string;
  slug: string;
  subcategories: {
    name: string;
    path: string;
  }[];
}

interface Product {
  id: number;
  name: string;
  images: Array<{ image_url: string }>;
  skus: Array<{ price: number }>;
}

interface CartItem {
  combo_id: number;
  name: string;
  image_url: string;
  price: number;
  quantity: number;
}

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<ProcessedCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        handleSearch();
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/products`);
      const data = await response.json();
      
      const filtered = data.data.filter((product: Product) => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
      
      setSearchResults(filtered);
      setShowResults(true);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const navigateToProduct = (productId: number) => {
    router.push(`/product/${productId}`);
    setShowResults(false);
    setSearchQuery('');
    setIsMenuOpen(false);
  };

  const handleSearchRedirect = () => {
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setShowResults(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults) return;
  
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedResultIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedResultIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedResultIndex >= 0) {
          const selectedProduct = searchResults[selectedResultIndex];
          navigateToProduct(selectedProduct.id);
        } else {
          handleSearchRedirect();
        }
        break;
      case 'Escape':
        setShowResults(false);
        break;
    }
  };
  

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        const result = await response.json();
        
        if (result.status === 'success') {
          // Lấy tất cả categories và chuyển đổi sang định dạng cần thiết
          const processedCategories = result.data.map((cat: Category) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            subcategories: [] // Không cần subcategories nữa
          }));
          
          setCategories(processedCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const [cartCount, setCartCount] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Đánh dấu là client-side
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]") as CartItem[];
    const totalQuantity = storedCart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
    setCartCount(totalQuantity);
  }, []);

  const staticCategories = [
    {
      id: 1,
      name: "Trang Chủ",
      path: "/",
    },
    {
      id: 2,
      name: "Sản phẩm",
      path: "/shop",
      subcategories: categories.length > 0
        ? categories.map((cat) => ({
            name: cat.name,
            path: `/category/${cat.id}`,
          }))
        : [],
    },
    {
      id: 3,
      name: "Về chúng tôi",
      path: "/about",
    },
    {
      id: 4,
      name: "Liên hệ",
      path: "/contact",
    },
    {
      id: 5,
      name: 'Bài viết',
      path: '/blog',
    },
    {
      id: 6,
      name: 'Voucher',
      path: '/voucher',
    },
  ];

  const renderSearchResults = () => {
    if (!showResults || searchResults.length === 0) return null;

    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg overflow-hidden z-50">
        {searchResults.map((product, index) => (
          <div
            key={product.id}
            className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer ${
              index === selectedResultIndex ? 'bg-pink-50' : ''
            }`}
            onClick={() => navigateToProduct(product.id)}
          >
            <div className="relative w-12 h-12 rounded overflow-hidden">
              <Image
                src={product.images?.[0]?.image_url || "/oxy.jpg"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="ml-3 flex-1">
              <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
              <p className="text-sm text-pink-600">
                {product.skus?.[0]?.price.toLocaleString()}đ
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="bg-gray-100 py-2">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          Miễn phí vận chuyển cho đơn hàng từ 1.000.000đ
        </div>
      </div>
      
      <header className="bg-white shadow-sm z-50 sticky top-0">
        <div className="max-w-7xl container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center">
              <span className="text-pink-600 font-serif font-bold text-2xl">
                Z
              </span>
              <span className="text-gray-700 font-serif font-bold text-2xl">
                BEAUTY
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              {staticCategories.map((category) => (
                <div key={category.id} className="group relative">
                  <Link
                    href={category.path}
                    className="flex items-center text-gray-700 hover:text-pink-600 py-4 text-sm font-medium"
                  >
                    {category.name}
                    {category.subcategories && category.subcategories.length > 0 && (
                      <ChevronDown className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180" />
                    )}
                  </Link>
                  {category.subcategories &&
                    category.subcategories.length > 0 && (
                      <div className="hidden group-hover:block absolute top-full left-0 w-screen max-w-4xl bg-white shadow-lg rounded-lg py-6 px-8 transition-all duration-300">
                        <div className="grid grid-cols-4 gap-4">
                          {category.subcategories.map((sub, index) => (
                            <Link
                              key={`${sub.path}-${index}`}
                              href={sub.path}
                              className="block px-4 py-2 text-sm text-gray-600 hover:bg-pink-50 hover:text-pink-600 transition-colors rounded-lg"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              ))}
            </nav>

            <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center relative" ref={searchRef}>
  <div className="relative text-black">
    <input
      type="text"
      placeholder="Tìm kiếm sản phẩm..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onKeyDown={handleKeyDown}
      className="w-64 px-4 py-2 bg-gray-50 border border-gray-200 rounded-l-lg focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-200 transition-colors text-sm"
    />
    {searchQuery && (
      <button
        onClick={() => {
          setSearchQuery('');
          setSearchResults([]);
          setShowResults(false);
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        <X className="h-4 w-4" />
      </button>
    )}
  </div>
  <button
    onClick={handleSearchRedirect}
    className="px-4 py-2 bg-pink-600 text-white rounded-r-lg hover:bg-pink-500 transition-colors"
  >
    <Search className="h-5 w-5" />
  </button>
  {renderSearchResults()}
</div>

              

              <Link
      href="/cart"
      className="p-2 hover:text-pink-600 transition-colors relative"
    >
      <ShoppingBag className="h-6 w-6" />
      {isClient && cartCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
          {cartCount}
        </span>
      )}
    </Link>

              <Link
                href="/profile"
                className="p-2 hover:text-pink-600 transition-colors"
              >
                <User className="h-6 w-6" />
              </Link>

              <button
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div
          className={`fixed inset-y-0 left-0 w-72 bg-white transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 pb-6 pt-[150px]">
            <div className="mb-6 relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-300 text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                    setShowResults(false);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              {renderSearchResults()}
            </div>

            {staticCategories.map((category) => (
              <div key={category.id} className="mb-6">
                <Link
                  href={category.path}
                  className="font-medium text-gray-900 hover:text-pink-600 block mb-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
                {category.subcategories &&
                  category.subcategories.length > 0 && (
                    <div className="ml-4 grid grid-cols-2 gap-2">
                      {category.subcategories.map((sub, index) => (
                        <Link
                          key={`${sub.path}-${index}`}
                          href={sub.path}
                          className="block text-sm text-gray-600 hover:text-pink-600 hover:bg-pink-50 px-2 py-1 rounded"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
