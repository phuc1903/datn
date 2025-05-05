"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { API_BASE_URL } from "@/config/config";

interface Product {
  id: number;
  name: string;
  short_description: string;
  images: Array<{ image_url: string }>;
}

interface Blog {
  id: number;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
  products: Product[];
}

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/blogs/${id}`);
        const data = await response.json();
        
        if (data?.status === "success") {
          setBlog(data.data);
        }
      } catch (error) {
        console.error("Error fetching blog details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBlogDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy bài viết</h2>
          <Link 
            href="/blog" 
            className="inline-block px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
          >
            Quay lại trang Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[400px] bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 z-10"></div>
        <div className="relative h-full w-full">
          <Image
            src={blog.image_url || "/default-blog.jpg"}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-20 p-8">
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-4xl font-bold text-white mb-4">{blog.title}</h1>
            <p className="text-gray-200">
              {new Date(blog.created_at).toLocaleDateString('vi-VN')}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto max-w-4xl px-4 py-12">
        <article className="bg-white rounded-xl shadow-lg p-8">
          <div className="prose max-w-none">
            <div className="text-gray-700 leading-relaxed text-lg space-y-6" 
                 dangerouslySetInnerHTML={{ __html: blog.description }} 
            />
          </div>
        </article>

       {/* Related Products Section */}
{blog.products.length > 0 && (
  <section className="w-full bg-white mt-16 rounded-xl shadow-lg p-8">
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Sản phẩm liên quan</h2>
        <div className="h-1 flex-1 mx-8 bg-gradient-to-r from-pink-500/50 to-transparent"></div>
      </div>
      
      <div className={`grid gap-6 ${
        blog.products.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' :
        blog.products.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto' :
        blog.products.length === 3 ? 'grid-cols-1 md:grid-cols-3 max-w-4xl mx-auto' :
        'grid-cols-2 md:grid-cols-4 max-w-7xl mx-auto'
      }`}>
        {blog.products.map((product) => (
          <Link href={`/product/${product.id}`} key={product.id} className="block">
            <div className="relative bg-white rounded-lg shadow-md overflow-hidden group p-4 hover:shadow-xl transition-shadow">
              <div className="relative w-full aspect-square mb-4 overflow-hidden">
                <Image
                  src={product.images?.[0]?.image_url || "/default-product.jpg"}
                  alt={product.name}
                  fill
                  className="object-cover transform transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-green-100 text-green-600 text-xs font-medium px-2 py-1 rounded-full">
                  {product.name.split(' ')[0]}
                </span>
              </div>
              
              <h3 className="text-sm font-medium mb-2 line-clamp-2 text-gray-800 min-h-[2.5rem]">
                {product.name}
              </h3>
              
              <p className="text-gray-600 text-sm line-clamp-2 mb-4 min-h-[2.5rem]">
                {product.short_description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-yellow-500 text-sm">★ 4.9</span>
                <button className="bg-pink-600 text-white py-2 px-4 rounded text-sm hover:bg-pink-700 transition-colors">
                  Xem chi tiết
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
        )}

        {/* Back to Blog Button */}
        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-block px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
          >
            ← Quay lại trang Blog
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;