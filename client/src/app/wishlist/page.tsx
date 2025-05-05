"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2, Eye } from "lucide-react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { API_BASE_URL } from "@/config/config";

interface WishlistItem {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  image: string;
  inStock: boolean;
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistItems = async () => {
      setIsLoading(true);

      const accessToken = Cookies.get("accessToken");

      if (!accessToken) {
        Swal.fire({
          icon: "error",
          title: "Bạn chưa đăng nhập",
          text: "Vui lòng đăng nhập để xem danh sách yêu thích!",
          confirmButtonColor: "#ec4899",
        }).then(() => {
          window.location.href = "/login";
        });
        setIsLoading(false);
        return;
      }

      try {
        // Lấy danh sách wishlist
        const wishlistResponse = await fetch(`${API_BASE_URL}/users/favorites`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!wishlistResponse.ok) {
          throw new Error("Failed to fetch wishlist items");
        }

        const wishlistData = await wishlistResponse.json();
        const favorites = wishlistData.data.favorites;

        // Lấy chi tiết sản phẩm cho từng sản phẩm trong wishlist
        const detailedItems = await Promise.all(
          favorites.map(async (favorite: any) => {
            const productResponse = await fetch(
              `${API_BASE_URL}/products/detail/${favorite.id}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (!productResponse.ok) {
              throw new Error(`Failed to fetch details for product ${favorite.id}`);
            }

            const productData = await productResponse.json();
            const product = productData.data;

            // Chọn SKU đầu tiên để hiển thị giá và hình ảnh
            const firstSku = product.skus[0];

            return {
              id: favorite.id,
              name: favorite.name,
              brand: favorite.admin_id === 1 ? "Various" : "Unknown",
              price: firstSku.promotion_price > 0 ? firstSku.promotion_price : firstSku.price,
              originalPrice: firstSku.price,
              image: firstSku.image_url,
              inStock: favorite.status !== "out_of_stock",
            };
          })
        );

        setWishlistItems(detailedItems);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không thể tải danh sách yêu thích. Vui lòng thử lại sau!",
          confirmButtonColor: "#ec4899",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlistItems();
  }, []);

  const removeFromWishlist = async (id: number) => {
    Swal.fire({
      title: "Xác nhận",
      text: "Bạn có chắc muốn xóa sản phẩm này khỏi danh sách yêu thích?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#ec4899",
      cancelButtonColor: "#9ca3af",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const accessToken = Cookies.get("accessToken");

          if (!accessToken) {
            throw new Error("No access token found");
          }

          const response = await fetch(`${API_BASE_URL}/users/remove-favorite`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              product_id: id,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to remove item from wishlist");
          }

          setWishlistItems(wishlistItems.filter((item) => item.id !== id));
          showToast("Đã xóa sản phẩm khỏi danh sách yêu thích", "success");
        } catch (error) {
          console.error("Error removing from wishlist:", error);
          showToast("Không thể xóa sản phẩm. Vui lòng thử lại!", "error");
        }
      }
    });
  };

  const showToast = (message: string, icon: 'success' | 'error' | 'warning' | 'info' | 'question') => {
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

    Toast.fire({
      icon: icon,
      title: message,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Danh sách yêu thích | Beauty Shop</title>
        <meta name="description" content="Danh sách sản phẩm yêu thích của bạn" />
      </Head>

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
              <Heart className="mr-2 text-pink-500" size={24} />
              Danh sách yêu thích
            </h1>
            <Link href="/shop" className="text-pink-500 hover:text-pink-600 transition-colors font-medium">
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="flex justify-center mb-4">
              <Heart className="text-gray-300" size={64} />
            </div>
            <h2 className="text-xl font-medium text-gray-700 mb-4">Danh sách yêu thích của bạn đang trống</h2>
            <p className="text-gray-500 mb-6">Hãy thêm các sản phẩm yêu thích để xem chúng tại đây</p>
            <Link
              href="/shop"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors"
            >
              Khám phá sản phẩm
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow relative group"
                >
                  <div className="relative h-48 bg-gray-100">
                    <Image
                      src={item.image || "/api/placeholder/200/200"}
                      alt={item.name}
                      className="object-cover"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                      aria-label="Xóa khỏi danh sách yêu thích"
                    >
                      <Trash2 size={18} className="text-gray-600" />
                    </button>
                    {!item.inStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <div className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium">
                          Hết hàng
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-gray-500 mb-1">{item.brand}</div>
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 h-12">{item.name}</h3>
                    <div className="flex items-baseline mb-3">
                      <span className="font-semibold text-gray-900">{formatPrice(item.price)}</span>
                      {item.originalPrice > item.price && (
                        <span className="ml-2 text-sm text-gray-500 line-through">
                          {formatPrice(item.originalPrice)}
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/product/${item.id}`}
                      className="w-full py-2 px-4 rounded-md flex items-center justify-center transition-colors bg-pink-500 hover:bg-pink-600 text-white"
                    >
                      <Eye size={18} className="mr-2" />
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm">
                Bạn đang có {wishlistItems.length} sản phẩm trong danh sách yêu thích
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}