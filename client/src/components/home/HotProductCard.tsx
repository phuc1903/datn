import Image from "next/image";
import Link from "next/link";
import { ShoppingCartIcon, Heart } from "lucide-react";
import { Product } from "@/types/product";

interface HotProductCardProps {
  product: Product;
  isLarge?: boolean;
  onAction: (product: Product, type: "addToCart" | "buyNow", e?: React.MouseEvent) => void;
  onToggleFavorite: (productId: string) => void;
  userFavorites: Set<string>;
}

const HotProductCard = ({ product, isLarge = false, onAction, onToggleFavorite, userFavorites }: HotProductCardProps) => {
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
                onClick={(e) => onAction(product, "buyNow", e)}
                className="bg-gray-900 text-white px-6 py-2 rounded hover:bg-gray-800"
              >
                Mua
              </button>
              <button
                onClick={(e) => onAction(product, "addToCart", e)}
                className="bg-pink-600 text-white p-2 rounded hover:bg-pink-700"
                title="Thêm vào giỏ hàng"
              >
                <ShoppingCartIcon className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleFavorite(product.id);
                }}
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