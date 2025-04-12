import Image from "next/image";
import Link from "next/link";
import { ShoppingCartIcon, Heart } from "lucide-react";
import { Product } from "@/types/product";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { API_BASE_URL } from "@/config/config";

interface HotProductCardProps {
  product: Product;
  isLarge?: boolean;
  onAction: (product: Product, type: "addToCart" | "buyNow", e?: React.MouseEvent) => void;
  onToggleFavorite: (productId: string) => void;
  userFavorites: Set<string>;
}

const HotProductCard = ({ product, isLarge = false, onAction, onToggleFavorite, userFavorites }: HotProductCardProps) => {
  const router = useRouter();
  const token = Cookies.get("accessToken");

  const handleAddToCart = async (e: React.MouseEvent) => {
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Bạn cần đăng nhập!",
        text: "Vui lòng đăng nhập để thêm vào giỏ hàng.",
        confirmButtonText: "Đăng nhập",
      }).then(() => router.push("/login"));
      return;
    }

    try {
      const cartItem = {
        product_id: parseInt(product.id),
        sku_id: product.skus?.[0]?.id,
        quantity: 1
      };

      const response = await fetch(`${API_BASE_URL}/carts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cartItem),
      });

      if (!response.ok) {
        throw new Error("Lỗi khi thêm vào giỏ hàng");
      }

      Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: "Đã thêm sản phẩm vào giỏ hàng",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Không thể thêm vào giỏ hàng. Vui lòng thử lại sau.",
      });
    }
  };

  const handleBuyNow = async (e: React.MouseEvent) => {
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Bạn cần đăng nhập!",
        text: "Vui lòng đăng nhập để mua hàng.",
        confirmButtonText: "Đăng nhập",
      }).then(() => router.push("/login"));
      return;
    }

    try {
      const cartItem = {
        product_id: parseInt(product.id),
        sku_id: product.skus?.[0]?.id,
        quantity: 1
      };

      const response = await fetch(`${API_BASE_URL}/carts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cartItem),
      });

      if (!response.ok) {
        throw new Error("Lỗi khi thêm vào giỏ hàng");
      }

      router.push("/checkout");
    } catch (error) {
      console.error("Lỗi khi mua hàng:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Không thể mua hàng. Vui lòng thử lại sau.",
      });
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Bạn cần đăng nhập!",
        text: "Vui lòng đăng nhập để thêm vào yêu thích.",
        confirmButtonText: "Đăng nhập",
      }).then(() => router.push("/login"));
      return;
    }

    try {
      const url = userFavorites.has(product.id) 
        ? `${API_BASE_URL}/users/remove-favorite`
        : `${API_BASE_URL}/users/add-favorite`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: parseInt(product.id) }),
      });

      if (!response.ok) {
        throw new Error("Lỗi khi cập nhật yêu thích");
      }

      onToggleFavorite(product.id);
    } catch (error) {
      console.error("Lỗi khi cập nhật yêu thích:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Không thể cập nhật yêu thích. Vui lòng thử lại sau.",
      });
    }
  };

  return (
    <Link href={`/product/${product.id}`} className="block">
      <div className={`relative bg-white rounded-lg shadow-lg overflow-hidden group ${isLarge ? "md:h-[600px]" : "h-[192px]"}`}>
        <Image
          src={product.images?.[0]?.image_url || "/oxy.jpg"}
          alt={product.name}
          fill
          className="object-cover transform transition-transform duration-300 group-hover:scale-105"
          sizes={isLarge ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
          loading={isLarge ? "eager" : "lazy"}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className={`font-semibold text-white mb-2 line-clamp-${isLarge ? "2" : "1"} ${isLarge ? "text-2xl" : "text-base"}`}>
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {product.skus?.[0]?.promotion_price > 0 ? (
                <>
                  <span className="line-through text-gray-300 text-sm">{product.skus?.[0]?.price.toLocaleString()}đ</span>
                  <span className="text-white font-bold">{product.skus?.[0]?.promotion_price.toLocaleString()}đ</span>
                </>
              ) : (
                <span className="text-white font-bold">{product.skus?.[0]?.price.toLocaleString()}đ</span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleBuyNow}
                className="bg-gray-900 text-white px-6 py-2 rounded hover:bg-gray-800"
              >
                Mua
              </button>
              <button
                onClick={handleAddToCart}
                className="bg-pink-600 text-white p-2 rounded hover:bg-pink-700"
                title="Thêm vào giỏ hàng"
              >
                <ShoppingCartIcon className="w-5 h-5" />
              </button>
              <button
                onClick={handleToggleFavorite}
                className={`p-2 rounded ${userFavorites.has(product.id) ? "text-red-600" : "text-gray-400"} hover:text-red-700`}
                title="Thêm vào yêu thích"
              >
                <Heart className="w-5 h-5" fill={userFavorites.has(product.id) ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HotProductCard; 