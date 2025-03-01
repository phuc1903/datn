"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Blog {
  id: number;
  title: string;
  short_description: string;
  image_url: string;
  created_at: string;
}

const BlogHome = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/blogs");
        const data = await response.json();
        
        if (data?.status === "success") {
          // Sort blogs by created_at in descending order
          const sortedBlogs = data.data.sort((a: Blog, b: Blog) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          setBlogs(sortedBlogs);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    if (blogs.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % 4);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [blogs]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  // Get the 4 most recent blogs for both slider and featured section
  const recentBlogs = blogs.slice(0, 4);

  return (
    <div className=" min-h-screen bg-gray-50">
      {/* Hero Section with Slider */}
      <div className="relative h-[500px] overflow-hidden bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 z-10"></div>
        
        <div className="relative h-full w-full">
          {recentBlogs.map((blog, index) => (
            <div
              key={blog.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="relative w-full h-full">
                <Image
                  src={blog.image_url || "/default-blog.jpg"}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {recentBlogs.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide ? "bg-pink-500 w-4" : "bg-white"
              }`}
            />
          ))}
        </div>

        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-20 text-center w-full px-4">
          <h2 className="text-white text-4xl font-bold mb-4">
            {recentBlogs[currentSlide]?.title}
          </h2>
          <p className="text-gray-200 text-lg max-w-2xl mx-auto">
            {recentBlogs[currentSlide]?.short_description}
          </p>
          <Link
            href={`/blog/${recentBlogs[currentSlide]?.id}`}
            className="inline-block mt-6 px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
          >
            Đọc thêm
          </Link>
        </div>
      </div>

      {/* All Posts Section */}
      <div className="max-w-7xl container mx-auto px-4 py-16">
        {/* Featured Recent Posts */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Bài viết nổi bật</h2>
            <div className="h-1 flex-1 mx-8 bg-gradient-to-r from-pink-500/50 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentBlogs.map((blog) => (
              <Link 
                href={`/blog/${blog.id}`}
                key={blog.id}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={blog.image_url || "/default-blog.jpg"}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-pink-500 transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(blog.created_at).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* All Blog Posts */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Tất cả bài viết</h2>
            <div className="h-1 flex-1 mx-8 bg-gradient-to-r from-pink-500/50 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link 
                href={`/blog/${blog.id}`}
                key={blog.id}
                className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={blog.image_url || "/default-blog.jpg"}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-pink-500 transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-2">
                    {blog.short_description}
                  </p>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-pink-500 font-medium">
                      Đọc thêm →
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(blog.created_at).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogHome;