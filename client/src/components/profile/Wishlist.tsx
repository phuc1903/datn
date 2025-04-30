import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Trash2, Eye } from "lucide-react";
import { WishlistItem } from "@/types/profile";

interface WishlistProps {
  items: WishlistItem[];
  onRemove: (id: number) => void;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

const Wishlist = ({ items, onRemove }: WishlistProps) => (
  <div>
    <h2 className="text-xl font-semibold mb-4 text-pink-500">Danh sách sản phẩm yêu thích</h2>
    {items.length === 0 ? (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center text-black">
        <Heart className="text-gray-300 mx-auto mb-4" size={64} />
        <h2 className="text-xl font-medium text-gray-700 mb-4">Danh sách yêu thích trống</h2>
        <Link href="/shop" className="inline-flex items-center px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-md">
          Khám phá sản phẩm
        </Link>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow relative text-black">
            <div className="relative h-48 bg-gray-100">
              <Image src={item.image} alt={item.name} className="object-cover" fill sizes="(max-width: 768px) 100vw, 33vw" />
              <button
                onClick={() => onRemove(item.id)}
                className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
              >
                <Trash2 size={18} className="text-gray-600" />
              </button>
              {!item.inStock && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <div className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm">Hết hàng</div>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="text-xs text-gray-500 mb-1">{item.brand}</div>
              <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 h-12">{item.name}</h3>
              <div className="flex items-baseline mb-3">
                <span className="font-semibold text-gray-900">{formatPrice(item.price)}</span>
                {item.originalPrice > item.price && (
                  <span className="ml-2 text-sm text-gray-500 line-through">{formatPrice(item.originalPrice)}</span>
                )}
              </div>
              <Link href={`/product/${item.id}`} className="w-full py-2 px-4 rounded-md flex items-center justify-center bg-pink-500 hover:bg-pink-600 text-white">
                <Eye size={18} className="mr-2" /> Xem
              </Link>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default React.memo(Wishlist); 