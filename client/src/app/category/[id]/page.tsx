"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ProductCard from '@/components/home/ProductCard';
import { API_BASE_URL } from "@/config/config";
import { Product } from '@/types/product';
import { ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const CategoryPage = () => {
  const params = useParams();
  const categoryId = params.id;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"az" | "za">("az");
  const [categoryName, setCategoryName] = useState<string>('');
  const [filters, setFilters] = useState({
    priceRange: 'all',
    status: 'all'
  });
  const { addToCart, buyNow } = useCart();
  const { favorites, toggleFavorite } = useFavorites();

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  const handleToggleFavorite = async (productId: string): Promise<void> => {
    const token = Cookies.get("accessToken");
    if (!token) {
      Toast.fire({ icon: "error", title: "Vui lòng đăng nhập để sử dụng tính năng này" });
      return;
    }

    const isFavorited = favorites.has(productId);
    const url = isFavorited
      ? `${API_BASE_URL}/users/remove-favorite`
      : `${API_BASE_URL}/users/add-favorite`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ product_id: productId }),
      });

      if (!response.ok) throw new Error("Thao tác thất bại");

      const result = await response.json();
      if (result.status === "success") {
        toggleFavorite(productId);
        Toast.fire({
          icon: "success",
          title: isFavorited ? "Đã xóa khỏi danh sách yêu thích" : "Đã thêm vào danh sách yêu thích",
        });
      }
    } catch (error) {
      console.error("Favorite error:", error);
      Toast.fire({ icon: "error", title: "Có lỗi xảy ra. Vui lòng thử lại" });
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/products/category/${categoryId}`);
        const data = await response.json();

        if (data.status === 'success') {
          const formattedProducts = data.data.map((product: any) => ({
            id: product.id.toString(),
            name: product.name,
            short_description: product.short_description,
            image_url: product.images?.[0]?.image_url || '',
            price: product.skus?.[0]?.price || 0,
            status: product.status || 'active',
            is_hot: product.is_hot || false,
            created_at: product.created_at || new Date().toISOString(),
            skus: product.skus || [],
            images: product.images || [],
            categories: product.categories || []
          }));
          setProducts(formattedProducts);
          if (formattedProducts.length > 0 && formattedProducts[0].categories?.length > 0) {
            setCategoryName(formattedProducts[0].categories[0].name);
          }
        } else {
          setError('Không thể tải sản phẩm');
        }
      } catch (err) {
        setError('Đã xảy ra lỗi khi tải sản phẩm');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchProducts();
    }
  }, [categoryId]);

  // Lọc sản phẩm theo các tiêu chí
  const filteredProducts = products.filter(product => {
    const price = product.skus?.[0]?.price || 0;
    
    // Lọc theo khoảng giá
    switch (filters.priceRange) {
      case 'under100k':
        if (price >= 100000) return false;
        break;
      case '100k-300k':
        if (price < 100000 || price > 300000) return false;
        break;
      case '300k-500k':
        if (price < 300000 || price > 500000) return false;
        break;
      case 'over500k':
        if (price <= 500000) return false;
        break;
    }

    // Lọc theo trạng thái
    if (filters.status !== 'all' && product.status !== filters.status) {
      return false;
    }

    return true;
  });

  // Sắp xếp sản phẩm đã lọc
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "az") {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  const handleAction = (product: Product, type: "addToCart" | "buyNow") => {
    if (type === "addToCart") {
      addToCart(product);
    } else {
      buyNow(product);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-red-600 mb-4 text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><a href="/" className="hover:text-pink-600">Trang chủ</a></li>
            <li><span className="mx-2">/</span></li>
            <li className="text-pink-600 font-medium">{categoryName || 'Danh mục sản phẩm'}</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{categoryName || 'Danh mục sản phẩm'}</h1>
              <p className="text-gray-500">Hiển thị {sortedProducts.length} sản phẩm</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Sắp xếp theo:</span>
              <Select value={sortBy} onValueChange={(value: "az" | "za") => setSortBy(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Chọn cách sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="az">Tên A-Z</SelectItem>
                  <SelectItem value="za">Tên Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Khoảng giá</label>
              <select
                value={filters.priceRange}
                onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                className="w-full appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="all">Tất cả</option>
                <option value="under100k">Dưới 100.000đ</option>
                <option value="100k-300k">100.000đ - 300.000đ</option>
                <option value="300k-500k">300.000đ - 500.000đ</option>
                <option value="over500k">Trên 500.000đ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="all">Tất cả</option>
                <option value="active">Đang bán</option>
                <option value="inactive">Hết hàng</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {sortedProducts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">Không có sản phẩm nào phù hợp với bộ lọc</p>
            <button
              onClick={() => setFilters({ priceRange: 'all', status: 'all' })}
              className="inline-block px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {sortedProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
                onAction={handleAction}
                onToggleFavorite={handleToggleFavorite}
                userFavorites={favorites}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage; 