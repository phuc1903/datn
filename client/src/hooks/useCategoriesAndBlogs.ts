import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config/config';
import { Category } from '@/types/product';
import { Product } from '@/types/product';
import Cookies from 'js-cookie';

interface Blog {
  id: string;
  title: string;
  short_description: string;
  image_url: string;
}

interface Combo {
  id: number;
  name: string;
  image_url: string;
  price: number;
  promotion_price: number;
  date_end: string;
  date_start: string;
  quantity: number;
  slug: string;
}

export const useCategoriesAndBlogs = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCombos, setLoadingCombos] = useState(true);
  const [combos, setCombos] = useState<Combo[]>([]);
  const [comingSoonCombos, setComingSoonCombos] = useState<Combo[]>([]);
  const [inStockProducts, setInStockProducts] = useState<Product[]>([]);
  const [hotProducts, setHotProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [userFavorites, setUserFavorites] = useState<Set<string>>(new Set());

  const getRandomItems = <T,>(arr: T[], num: number): T[] => {
    if (!arr || !Array.isArray(arr) || arr.length === 0) return [];
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(num, arr.length));
  };

  const refreshToken = async () => {
    const refreshToken = Cookies.get("refreshToken");
    if (!refreshToken) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        Cookies.set("accessToken", data.access_token);
        return data.access_token;
      }
      return null;
    } catch (error) {
      console.error("Lỗi khi làm mới token:", error);
      return null;
    }
  };

  const fetchUserFavorites = async (token: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/favorites`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          const newToken = await refreshToken();
          if (newToken) {
            const retryResponse = await fetch(`${API_BASE_URL}/users/favorites`, {
              method: "GET",
              headers: { "Authorization": `Bearer ${newToken}` },
            });
            if (!retryResponse.ok) throw new Error("Failed to fetch favorites after token refresh");
            
            const retryData = await retryResponse.json();
            if (retryData.status === "success" && Array.isArray(retryData.data.favorites)) {
              setUserFavorites(new Set(retryData.data.favorites.map((item: { id: string }) => item.id)));
            }
            return;
          }
        }
        throw new Error(`Failed to fetch favorites: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.status === "success" && Array.isArray(data.data.favorites)) {
        setUserFavorites(new Set(data.data.favorites.map((item: { id: string }) => item.id)));
      }
    } catch (error) {
      console.error("Error fetching user favorites:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          categoriesRes,
          blogsRes,
          productsRes,
          favoritesRes,
          nearlyEndRes,
          nearlyStartRes
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/categories`),
          fetch(`${API_BASE_URL}/blogs`),
          fetch(`${API_BASE_URL}/products`),
          fetch(`${API_BASE_URL}/products/most-favorites`),
          fetch(`${API_BASE_URL}/combos/nearly-end`),
          fetch(`${API_BASE_URL}/combos/nearly-start`)
        ]);

        const [
          categoriesData,
          blogsData,
          productsData,
          favoritesData,
          nearlyEndData,
          nearlyStartData
        ] = await Promise.all([
          categoriesRes.json(),
          blogsRes.json(),
          productsRes.json(),
          favoritesRes.json(),
          nearlyEndRes.json(),
          nearlyStartRes.json()
        ]);

        // Set categories and blogs
        setCategories(categoriesData.data || []);
        if (blogsData?.status === "success") {
          setBlogs(getRandomItems(blogsData.data || [], 3));
        }

        // Set products
        const filteredProducts = productsData.data?.filter((product: Product) => product.status !== "out_of_stock") || [];
        setInStockProducts(filteredProducts);
        
        const sortedProducts = [...filteredProducts].sort((a: Product, b: Product) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setHotProducts(getRandomItems(filteredProducts.filter((p: Product) => p.is_hot), 4));
        setNewProducts(getRandomItems(sortedProducts, 10));
        setRecommended(getRandomItems(filteredProducts, 10));
        setFavoriteProducts(getRandomItems(favoritesData.data || [], 10));

        // Set combos
        if (nearlyEndData.status === "success") {
          setCombos(nearlyEndData.data);
        }
        if (nearlyStartData.status === "success") {
          setComingSoonCombos(nearlyStartData.data);
        }
        setLoadingCombos(false);

        // Fetch user favorites if logged in
        const token = Cookies.get("accessToken");
        if (token) await fetchUserFavorites(token);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    categories,
    blogs,
    loading,
    loadingCombos,
    combos,
    comingSoonCombos,
    inStockProducts,
    hotProducts,
    newProducts,
    recommended,
    favoriteProducts,
    userFavorites,
    setUserFavorites
  };
}; 