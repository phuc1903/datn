import Image from "next/image";
import Link from "next/link";
import { ShoppingCartIcon, HeartIcon, ArrowRightIcon } from "lucide-react";
import { Product } from "@/types/product";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { API_BASE_URL } from "@/config/config";

interface ProductCardProps {
  product: Product;
  onAction: (product: Product, type: "addToCart" | "buyNow", e?: React.MouseEvent) => void;
  onToggleFavorite: (productId: string) => Promise<void>;
  userFavorites: Set<string>;
}

const ProductCard = ({ product, onAction, onToggleFavorite, userFavorites }: ProductCardProps) => {
  const router = useRouter();
  const token = Cookies.get("accessToken");
  const isFavorited = userFavorites.has(product.id);
  const isOutOfStock = product.skus?.[0]?.quantity === 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isOutOfStock) {
      Swal.fire({
        icon: "error",
        title: "Sản phẩm đã hết hàng!",
        text: "Vui lòng chọn sản phẩm khác.",
      });
      return;
    }
    
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

  const handleViewDetail = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/product/${product.id}`);
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await onToggleFavorite(product.id);
  };

  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden group p-4">
      <Link href={`/product/${product.id}`}>
        <div className="relative w-full aspect-square mb-4 overflow-hidden">
          <Image
            src={product.images?.[0]?.image_url || product.skus?.[0]?.image_url || "/oxy.jpg"}
            alt={product.name}
            fill
            className={`object-cover transform transition-transform duration-300 ${isOutOfStock ? "" : "group-hover:scale-110"}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-gray-800/60 flex items-center justify-center">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">Hết hàng</span>
            </div>
          )}
          <button
            onClick={handleToggleFavorite}
            className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors z-10"
          >
            <HeartIcon
              className={`w-5 h-5 ${isFavorited ? "text-red-500 fill-red-500" : "text-gray-500"}`}
            />
          </button>
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
          onClick={handleViewDetail}
          className="flex items-center px-4 py-2 rounded bg-gray-900 text-white hover:bg-gray-800"
        >
          <span>Xem thêm</span>
          <ArrowRightIcon className="w-4 h-4 ml-2" />
        </button>
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`p-2 rounded ${
            isOutOfStock 
              ? "bg-gray-400 text-white cursor-not-allowed" 
              : "bg-pink-600 text-white hover:bg-pink-700"
          }`}
          title={isOutOfStock ? "Sản phẩm hết hàng" : "Thêm vào giỏ hàng"}
        >
          <ShoppingCartIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard; 