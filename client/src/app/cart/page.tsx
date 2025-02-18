"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, ChevronRight, CreditCard } from "lucide-react";

interface CartItem {
  sku_id: number;
  name: string;
  image_url: string;
  price: number;
  quantity: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(storedCart);
    }
  }, []);

  const handleRemove = (sku_id: number) => {
    const updatedCart = cart.filter((item) => item.sku_id !== sku_id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (sku_id: number, quantity: number) => {
    if (quantity < 1) return;
    const updatedCart = cart.map((item) =>
      item.sku_id === sku_id ? { ...item, quantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const formatPrice = (price: number) => `${price.toLocaleString()} VND`;
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 30000 : 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-8 text-pink-500">Giỏ hàng của bạn</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              {cart.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {cart.map((item) => (
                    <div key={item.sku_id} className="p-6 flex gap-6">
                      <div className="w-24 h-24 flex-shrink-0">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-base font-medium text-gray-900">{item.name}</h3>
                          </div>
                          <button
                            onClick={() => handleRemove(item.sku_id)}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <div className="flex items-center border rounded-lg">
                            <button
                              className="p-2 hover:bg-gray-50 text-pink-600"
                              onClick={() => handleQuantityChange(item.sku_id, item.quantity - 1)}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 text-pink-600">{item.quantity}</span>
                            <button
                              className="p-2 hover:bg-gray-50 text-pink-600"
                              onClick={() => handleQuantityChange(item.sku_id, item.quantity + 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="text-lg font-medium text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-pink-500">Giỏ hàng trống</div>
              )}
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Tóm Tắt Đơn Hàng</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-base text-gray-600">
                  <span>Tạm Tính</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-base text-gray-600">
                  <span>Phí Vận Chuyển</span>
                  <span>{formatPrice(shipping)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-medium text-gray-900">
                    <span>Tổng Cộng</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
              <Link
                href="/checkout"
                className="w-full mt-6 bg-pink-600 hover:bg-purple-500 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                Tiến Hành Thanh Toán
              </Link>
              <Link
                href="/"
                className="w-full mt-4 text-pink-600 hover:text-purple-500 py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                Tiếp Tục Mua Sắm
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
