import Link from 'next/link';
import { useCategoriesAndBlogs } from '@/hooks/useCategoriesAndBlogs';
import { useState } from 'react';
import { API_BASE_URL } from '@/config/config';

const Categories = () => {
  const { categories, loading } = useCategoriesAndBlogs();
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Hàm xử lý URL để tránh trùng lặp domain
  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http')) {
      return imagePath; // Nếu đã là URL đầy đủ, trả về nguyên vẹn
    }
    return `${API_BASE_URL}/${imagePath}`; // Nếu là đường dẫn tương đối, thêm API_BASE_URL
  };

  if (loading) return (
    <section className="w-full px-4 py-12 bg-pink-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  );

  const displayedCategories = showAllCategories ? categories : categories.slice(0, 4);

  return (
    <section className="w-full px-4 py-12 bg-pink-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Danh Mục Sản Phẩm</h2>
          {!showAllCategories && categories.length > 4 && (
            <button 
              onClick={() => setShowAllCategories(true)} 
              className="text-pink-600 hover:text-pink-700 font-medium"
            >
              Xem tất cả
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {displayedCategories.map((category) => (
            <div key={category.id} className="group relative h-48 bg-white rounded-lg shadow-md overflow-hidden">
              <Link href={`/category/${category.id}`} className="block w-full h-full">
                <img
                  src={getImageUrl(category.image)}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-xl font-semibold">{category.name}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories; 