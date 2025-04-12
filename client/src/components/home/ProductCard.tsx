import Image from "next/image";
import Link from "next/link";
import { ShoppingCartIcon, Heart } from "lucide-react";
import { Product } from "@/types/product";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { API_BASE_URL } from "@/config/config";

interface ProductCardProps {
  product: Product;
  onAction: (product: Product, type: "addToCart" | "buyNow", e?: React.MouseEvent) => void;
  onToggleFavorite: (productId: string) => void;
  userFavorites: Set<string>;
}

const ProductCard = ({ product, onAction, onToggleFavorite, userFavorites }: ProductCardProps) => {
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
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden group p-4">
      <Link href={`/product/${product.id}`}>
        <div className="relative w-full aspect-square mb-4 overflow-hidden">
          <Image
            src={product.images?.[0]?.image_url || product.skus?.[0]?.image_url || "/oxy.jpg"}
            alt={product.name}
            fill
            className="object-cover transform transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
        </div>
      </Link>
      <div className="flex flex-wrap gap-2 mb-3">
        {product.categories?.map((category) => (
          <span key={category.id} className="bg-green-100 text-green-600 text-xs font-medium px-2 py-1 rounded-full">
            {category.name}
          </span>
        ))}
      </div>
      <h3 className="text-sm font-medium mb-2 line-clamp-2 text-gray-800">{product.name}</h3>
      <div className="mb-4">
        <span className="line-through text-gray-500 text-sm mr-2">
          {product.skus?.[0]?.price.toLocaleString()}đ
        </span>
        <span className="text-pink-600 font-bold text-lg">
          {(product.skus?.[0]?.promotion_price || product.skus?.[0]?.price).toLocaleString()}đ
        </span>
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
  );
};

export default ProductCard; 