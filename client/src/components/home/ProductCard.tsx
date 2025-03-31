import Image from "next/image";
import Link from "next/link";
import { ShoppingCartIcon, Heart } from "lucide-react";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  onAction: (product: Product, type: "addToCart" | "buyNow", e?: React.MouseEvent) => void;
  onToggleFavorite: (productId: string) => void;
  userFavorites: Set<string>;
}

const ProductCard = ({ product, onAction, onToggleFavorite, userFavorites }: ProductCardProps) => {
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
      <div className="flex items-center justify-between space-x-2 mb-4">
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
  );
};

export default ProductCard; 