import Image from 'next/image';
import Link from 'next/link';
import { useCategoriesAndBlogs } from '@/hooks/useCategoriesAndBlogs';

const Blogs = () => {
  const { blogs, loading } = useCategoriesAndBlogs();

  if (loading) return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Góc làm đẹp</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-40 bg-gray-200 animate-pulse" />
            <div className="p-4">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-full mb-4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Góc làm đẹp</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div key={blog.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <Image 
              src={blog.image_url || "/default-blog.jpg"} 
              alt={blog.title} 
              width={400} 
              height={225} 
              className="object-cover w-full h-40"
              loading="lazy"
            />
            <div className="p-4">
              <h3 className="text-lg text-black font-bold mb-2">{blog.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{blog.short_description}</p>
              <Link href={`/blog/${blog.id}`} className="text-pink-600 hover:text-pink-700 font-medium">
                Đọc thêm
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Blogs; 