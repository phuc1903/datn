"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Minus, Plus, X, ChevronRight, CreditCard } from "lucide-react";

const CartPage = () => {
  // Mock cart data
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Intensive Moisturizing Cream",
      brand: "SkinCare Plus",
      option: "50ml",
      price: 459000,
      quantity: 2,
      image: "/makup.jpg",
    },
    {
      id: 2,
      name: "Vitamin C Serum",
      brand: "Glow Labs",
      option: "30ml",
      price: 699000,
      quantity: 1,
      image: "/oxy.jpg",
    },
  ]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const updateQuantity = (id: number, type: 'increase' | 'decrease') => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = type === 'increase' ? item.quantity + 1 : item.quantity - 1;
        return {
          ...item,
          quantity: Math.max(1, newQuantity)
        };
      }
      return item;
    }));
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 30000;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        

        <h1 className="text-2xl font-semibold mb-8 text-pink-500">Giỏ hàng của bạn</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              {cartItems.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="flex gap-6">
                        {/* Product Image */}
                        <div className="w-24 h-24 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-base font-medium text-gray-900">
                                {item.name}
                              </h3>
                              <p className="mt-1 text-sm text-gray-500">{item.brand}</p>
                              <p className="mt-1 text-sm text-gray-500">Size: {item.option}</p>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-gray-400 hover:text-gray-500"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="mt-4 flex justify-between items-center">
                            <div className="flex items-center border rounded-lg">
                              <button
                                className="p-2 hover:bg-gray-50 text-pink-600"
                                onClick={() => updateQuantity(item.id, 'decrease')}
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-4 py-2 text-pink-600">{item.quantity}</span>
                              <button
                                className="p-2 hover:bg-gray-50 text-pink-600"
                                onClick={() => updateQuantity(item.id, 'increase')}
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
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-pink-500">
                 Giỏ hàng trống 
                </div>
              )}
            </div>
          </div>

          {/* Tóm Tắt Đơn Hàng */}
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
};

export default CartPage;