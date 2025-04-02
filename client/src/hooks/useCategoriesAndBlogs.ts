import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config/config';
import { Category } from '@/types/product';

interface Blog {
  id: string;
  title: string;
  short_description: string;
  image_url: string;
}

export const useCategoriesAndBlogs = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  const getRandomItems = <T,>(arr: T[], num: number): T[] => {
    if (!arr || !Array.isArray(arr) || arr.length === 0) return [];
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(num, arr.length));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesRes = await fetch(`${API_BASE_URL}/categories`);
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData.data || []);

        const blogsRes = await fetch(`${API_BASE_URL}/blogs`);
        const blogsData = await blogsRes.json();
        if (blogsData?.status === "success") {
          setBlogs(getRandomItems(blogsData.data || [], 3));
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories and blogs:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    categories,
    blogs,
    loading
  };
}; 