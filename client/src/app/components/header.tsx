"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, User, Heart, ChevronDown, Menu } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  path: string;
  subcategories: {
    name: string;
    path: string;
  }[];
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const categories: Category[] = [
    {
      id: 1,
      name: 'Trang Chủ',
      path: '/',
    },
    {
      id: 2,
      name: 'Sản phẩm',
      path: '/shop',
      subcategories: [
        { name: 'Kem nền', path: '/makeup/foundation' },
        { name: 'Son môi', path: '/makeup/lips' },
        { name: 'Phấn mắt', path: '/makeup/eyes' },
        { name: 'Má hồng', path: '/makeup/blush' }
      ]
    },
    {
      id: 3,
      name: 'Về chúng tôi',
      path: '/about',
    },
    {
      id: 4,
      name: 'Liên hệ',
      path: '/contact',
    },
  ];

  return (
    <>
      <div className="bg-gray-100 py-2">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          Miễn phí vận chuyển cho đơn hàng từ 1.000.000đ
        </div>
      </div>
      
      <header className="bg-white shadow-sm z-50 sticky">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center">
              <span className="text-pink-600 font-serif font-bold text-2xl">Z</span>
              <span className="text-gray-700 font-serif font-bold text-2xl">BEAUTY</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              {categories.map((category) => (
                <div key={category.id} className="group relative">
                  <Link 
                    href={category.path}
                    className="flex items-center text-gray-700 hover:text-pink-600 py-4 text-sm font-medium"
                  >
                    {category.name}
                    {category.subcategories && <ChevronDown className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180" />}
                  </Link>
                  {Array.isArray(category.subcategories) &&
                    <div className="hidden group-hover:block absolute top-full left-0 w-48 bg-white shadow-lg rounded-lg py-2 transition-all duration-300">
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub.path}
                          href={sub.path}
                          className="block px-4 py-2 text-sm text-gray-600 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                    }
                </div>
              ))}
            </nav>

            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-64 px-4 py-2 bg-gray-50 border border-gray-200 rounded-l-lg focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-200 transition-colors text-sm"
                />
                <button className="px-4 py-2 bg-pink-600 text-white rounded-r-lg hover:bg-pink-500 transition-colors">
                  <Search className="h-5 w-5" />
                </button>
              </div>
              
              <Link href="/wishlist" className="p-2 hover:text-pink-600 transition-colors relative">
                <Heart className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  0
                </span>
              </Link>
              
              <Link href="/cart" className="p-2 hover:text-pink-600 transition-colors relative">
                <ShoppingBag className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  0
                </span>
              </Link>
              
              <Link href="/profile" className="p-2 hover:text-pink-600 transition-colors">
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
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div 
          className={`fixed inset-y-0 left-0 w-72 bg-white transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="mb-6">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-300 text-sm"
              />
            </div>
            {categories.map((category) => (
              <div key={category.id} className="mb-6">
                <Link
                  href={category.path}
                  className="font-medium text-gray-900 hover:text-pink-600 block mb-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
                {Array.isArray(category.subcategories) &&
                  <div className="ml-4 space-y-2">
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub.path}
                        href={sub.path}
                        className="block text-sm text-gray-600 hover:text-pink-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                }
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;