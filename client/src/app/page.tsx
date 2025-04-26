"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { API_BASE_URL } from "@/config/config";
import { Product, CartItem, Sku } from "@/types/product";
import HeroSlider from "@/components/home/HeroSlider";
import Categories from "@/components/home/Categories";
import Blogs from "@/components/home/Blogs";
import ProductCard from "@/components/home/ProductCard";
import HotProductCard from "@/components/home/HotProductCard";
import { useProducts } from "@/hooks/useProducts";
import ComboCard from "@/components/home/ComboCard";

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

export default function HomePage() {
  const {
    hotProducts,
    newProducts,
    recommended,
    favoriteProducts,
    loading,
    userFavorites,
    setUserFavorites
  } = useProducts();

  const [combos, setCombos] = useState<Combo[]>([]);
  const [comingSoonCombos, setComingSoonCombos] = useState<Combo[]>([]);
  const [loadingCombos, setLoadingCombos] = useState(true);

  const [showVariantPopup, setShowVariantPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSku, setSelectedSku] = useState<Sku | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [actionType, setActionType] = useState<"addToCart" | "buyNow" | null>(null);

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

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const [nearlyEndResponse, nearlyStartResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/combos/nearly-end`),
          fetch(`${API_BASE_URL}/combos/nearly-start`)
        ]);

        const nearlyEndData = await nearlyEndResponse.json();
        const nearlyStartData = await nearlyStartResponse.json();

        if (nearlyEndData.status === "success") {
          setCombos(nearlyEndData.data);
        }
        if (nearlyStartData.status === "success") {
          setComingSoonCombos(nearlyStartData.data);
        }
      } catch (error) {
        console.error("Error fetching combos:", error);
      } finally {
        setLoadingCombos(false);
      }
    };

    fetchCombos();
  }, []);

  const handleToggleFavorite = async (productId: string): Promise<void> => {
    const token = Cookies.get("accessToken");
    if (!token) {
      Toast.fire({ icon: "error", title: "Vui lòng đăng nhập để sử dụng tính năng này" });
      return;
    }

    const isFavorited = userFavorites.has(productId);
    const url = isFavorited
      ? `${API_BASE_URL}/users/remove-favorite`
      : `${API_BASE_URL}/users/add-favorite`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ product_id: parseInt(productId) }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        if (response.status === 401) {
          // Thử refresh token
          const refreshToken = Cookies.get("refreshToken");
          if (refreshToken) {
            const refreshResponse = await fetch(`${API_BASE_URL}/refresh-token`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refresh_token: refreshToken }),
            });

            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json();
              Cookies.set("accessToken", refreshData.access_token, { expires: 7 });
              
              // Thử lại request với token mới
              const retryResponse = await fetch(url, {
                method: "POST",
                headers: { 
                  "Content-Type": "application/json", 
                  "Authorization": `Bearer ${refreshData.access_token}` 
                },
                body: JSON.stringify({ product_id: parseInt(productId) }),
              });

              const retryResult = await retryResponse.json();
              if (!retryResponse.ok) {
                throw new Error(retryResult.message || "Thao tác thất bại");
              }

              if (retryResult.status === "success") {
                const newFavorites = new Set(userFavorites);
                if (isFavorited) {
                  newFavorites.delete(productId);
                } else {
                  newFavorites.add(productId);
                }
                setUserFavorites(newFavorites);
                Toast.fire({
                  icon: "success",
                  title: isFavorited ? "Đã xóa khỏi danh sách yêu thích" : "Đã thêm vào danh sách yêu thích",
                });
              }
              return;
            }
          }
          throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại");
        }
        throw new Error(result.message || "Thao tác thất bại");
      }

      if (result.status === "success") {
        const newFavorites = new Set(userFavorites);
        if (isFavorited) {
          newFavorites.delete(productId);
        } else {
          newFavorites.add(productId);
        }
        setUserFavorites(newFavorites);
        Toast.fire({
          icon: "success",
          title: isFavorited ? "Đã xóa khỏi danh sách yêu thích" : "Đã thêm vào danh sách yêu thích",
        });
      } else {
        throw new Error(result.message || "Thao tác thất bại");
      }
    } catch (error) {
      console.error("Favorite error:", error);
      Toast.fire({ 
        icon: "error", 
        title: error instanceof Error ? error.message : "Có lỗi xảy ra. Vui lòng thử lại" 
      });
    }
  };

  const variantOptions = (product: Product) => {
    const options: Record<string, Set<string>> = {};
    product?.skus.forEach((sku) => {
      sku.variant_values.forEach((variant) => {
        if (!options[variant.variant.name]) options[variant.variant.name] = new Set();
        options[variant.variant.name].add(variant.value);
      });
    });
    return options;
  };

  const handleVariantChange = (e: React.MouseEvent<HTMLButtonElement>, variantName: string, value: string) => {
    e.stopPropagation();
    const newSelectedVariants = { ...selectedVariants, [variantName]: value };
    setSelectedVariants(newSelectedVariants);

    const matchedSku = selectedProduct?.skus.find((sku) =>
      sku.variant_values.every(
        (variant) => newSelectedVariants[variant.variant.name] === variant.value || !newSelectedVariants[variant.variant.name]
      )
    );
    if (matchedSku) setSelectedSku(matchedSku);
    setQuantity(1);
  };

  const handleAction = (product: Product, type: "addToCart" | "buyNow", e?: React.MouseEvent): void => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedProduct(product);
    setSelectedSku(product.skus ? product.skus[0] : null);
    setSelectedVariants({});
    setQuantity(1);
    setActionType(type);
    setShowVariantPopup(true);
  };

  const handleConfirmAction = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!selectedSku || !selectedProduct) return;

    const cartItem: CartItem = {
      sku_id: selectedSku.id,
      name: selectedProduct.name,
      image_url: selectedSku.image_url || selectedProduct.image_url,
      price: selectedSku.promotion_price > 0 ? selectedSku.promotion_price : selectedSku.price,
      quantity: quantity,
      variants: selectedSku?.variant_values?.map((variant) => ({
        name: variant.variant.name,
        value: variant.value,
      })) || [],
    };

    if (actionType === "addToCart") {
      const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existingItem = storedCart.find((item: CartItem) => item.sku_id === selectedSku.id);
      let updatedCart;

      if (existingItem) {
        updatedCart = storedCart.map((item: CartItem) =>
          item.sku_id === selectedSku.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, selectedSku.quantity) }
            : item
        );
      } else {
        updatedCart = [...storedCart, cartItem];
      }

      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } else if (actionType === "buyNow") {
      console.log("Buy Now:", cartItem);
    }

    setShowVariantPopup(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="h-[400px] bg-gray-200 animate-pulse" />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <HeroSlider />
      <Categories />

      {/* Flash Sale Combo Section */}
      {(!loadingCombos && combos.length > 0) && (
        <section className="w-full px-4 py-12 bg-gradient-to-r from-pink-500 to-red-500">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Flash Sale Combo</h2>
                <p className="text-pink-100">Ưu đãi có hạn - Nhanh tay sở hữu ngay!</p>
              </div>
              
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {combos.slice(0, 4).map((combo) => (
                <ComboCard key={combo.id} combo={combo} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Coming Soon Combo Section */}
      {(!loadingCombos && comingSoonCombos.length > 0) && (
        <section className="w-full px-4 py-12 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Combo Sắp Mở Bán</h2>
                <p className="text-gray-600">Đừng bỏ lỡ những ưu đãi sắp tới!</p>
              </div>
            </div>
            {comingSoonCombos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {comingSoonCombos.slice(0, 4).map((combo) => (
                  <ComboCard key={combo.id} combo={combo} isComingSoon />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600 text-lg">Hiện không có combo nào, hãy theo dõi!</p>
            )}
          </div>
        </section>
      )}

      {/* Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Sản Phẩm Hot</h2>
          <Link href="/shop" className="text-pink-600 hover:text-pink-700 font-medium">
            Xem tất cả
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {hotProducts.length > 0 && (
            <div className="md:col-span-2">
              <HotProductCard 
                product={hotProducts[0]} 
                isLarge={true}
                onAction={handleAction}
                onToggleFavorite={handleToggleFavorite}
                userFavorites={userFavorites}
              />
            </div>
          )}
          <div className="md:col-span-2 grid grid-cols-1 gap-6">
            {hotProducts.slice(1, 4).map((product) => (
              <HotProductCard 
                key={product.id} 
                product={product}
                onAction={handleAction}
                onToggleFavorite={handleToggleFavorite}
                userFavorites={userFavorites}
              />
            ))}
          </div>
        </div>
      </section>

      {/* New Products Section */}
      <section className="w-full px-4 py-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Sản phẩm mới</h2>
            <Link href="/shop" className="text-pink-600 hover:text-pink-700 font-medium">
              Xem tất cả
            </Link>
          </div>
          <div className="relative">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={24}
              slidesPerView={5}
              navigation={{
                nextEl: ".swiper-button-next-new",
                prevEl: ".swiper-button-prev-new"
              }}
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              breakpoints={{
                0: { slidesPerView: 2 },
                768: { slidesPerView: 4 },
                1024: { slidesPerView: 5 }
              }}
            >
              {newProducts.map((product) => (
                <SwiperSlide key={product.id}>
                  <ProductCard
                    product={product}
                    onAction={handleAction}
                    onToggleFavorite={handleToggleFavorite}
                    userFavorites={userFavorites}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <button className="swiper-button-prev-new absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-pink-600">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="swiper-button-next-new absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-pink-600">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Recommended Section */}
      <section className="w-full px-4 py-12 bg-pink-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Dành cho bạn</h2>
            <Link href="/shop" className="text-pink-600 hover:text-pink-700 font-medium">
              Xem tất cả
            </Link>
          </div>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={5}
            navigation={{ nextEl: ".swiper-button-next-recommended", prevEl: ".swiper-button-prev-recommended" }}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{ 0: { slidesPerView: 2 }, 768: { slidesPerView: 4 }, 1024: { slidesPerView: 5 } }}
          >
            {recommended.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard 
                  product={product}
                  onAction={handleAction}
                  onToggleFavorite={handleToggleFavorite}
                  userFavorites={userFavorites}
                />
              </SwiperSlide>
            ))}
            <div className="swiper-button-prev-recommended text-pink-600" />
            <div className="swiper-button-next-recommended text-pink-600" />
          </Swiper>
        </div>
      </section>

      {/* Favorite Products Section */}
      <section className="w-full px-4 py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Sản phẩm được yêu thích</h2>
          </div>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={5}
            navigation={{ nextEl: ".swiper-button-next-favorite", prevEl: ".swiper-button-prev-favorite" }}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{ 0: { slidesPerView: 2 }, 768: { slidesPerView: 4 }, 1024: { slidesPerView: 5 } }}
          >
            {favoriteProducts.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard 
                  product={product}
                  onAction={handleAction}
                  onToggleFavorite={handleToggleFavorite}
                  userFavorites={userFavorites}
                />
              </SwiperSlide>
            ))}
            <div className="swiper-button-prev-favorite text-pink-600" />
            <div className="swiper-button-next-favorite text-pink-600" />
          </Swiper>
        </div>
      </section>

      <Blogs />

      {/* FAQ Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 bg-gray-50">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Hỗ trợ khách hàng</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { question: "Làm sao để đặt hàng?", answer: "Bạn có thể đặt hàng trực tiếp trên website hoặc liên hệ qua hotline." },
            { question: "Chính sách đổi trả?", answer: "Hỗ trợ đổi trả trong 7 ngày kể từ khi nhận hàng." },
            { question: "Sản phẩm chính hãng?", answer: "Tất cả sản phẩm đều nhập khẩu chính hãng và có hóa đơn." },
          ].map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <h4 className="font-bold text-gray-800 mb-2">{faq.question}</h4>
              <p className="text-sm text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-pink-100 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Đăng ký nhận tin</h2>
          <p className="text-gray-600 mb-8">Nhận thông tin về sản phẩm mới và khuyến mãi hấp dẫn</p>
          <form className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <button type="submit" className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
              Đăng ký
            </button>
          </form>
        </div>
      </section>

      {/* Variant Popup */}
      {showVariantPopup && selectedProduct && selectedSku && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4 text-black">{selectedProduct.name}</h3>
            <div className="space-y-4">
              {selectedProduct.skus && Object.entries(variantOptions(selectedProduct)).map(([variantName, values]) => (
                <div key={variantName}>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">{variantName}:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Array.from(values).map((value) => (
                      <button
                        key={value}
                        className={`border rounded-lg py-2 px-4 text-sm font-medium ${
                          selectedVariants[variantName] === value ? "border-pink-600 text-pink-600" : "border-gray-200 text-gray-900 hover:border-gray-300"
                        }`}
                        onClick={(e) => handleVariantChange(e, variantName, value)}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Số lượng:</h4>
                <div className="flex items-center space-x-2 text-black">
                  <button
                    className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuantity(Math.max(1, quantity - 1));
                    }}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={selectedSku?.quantity || 1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(parseInt(e.target.value) || 1, selectedSku?.quantity || 1)))}
                    className="w-16 h-8 border border-gray-300 rounded text-center"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuantity(Math.min(quantity + 1, selectedSku?.quantity || 1));
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600">Còn lại: {selectedSku?.quantity || 0} sản phẩm</p>
              <p className="text-lg font-bold text-pink-600">
                {(selectedSku?.promotion_price > 0 ? selectedSku?.promotion_price : selectedSku?.price || 0).toLocaleString()}đ
              </p>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button 
                className="px-4 py-2 text-gray-600 hover:text-gray-800" 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setShowVariantPopup(false); 
                }}
              >
                Hủy
              </button>
              <button 
                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700" 
                onClick={handleConfirmAction}
              >
                {actionType === "addToCart" ? "Thêm vào giỏ" : "Mua ngay"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}