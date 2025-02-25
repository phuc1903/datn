"use client";

import { useState, useEffect } from "react";
import { Check, Shield, ChevronLeft } from "lucide-react";
import { CreditCard, Truck } from "lucide-react";


export default function CheckoutOrder() {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');
  const [cartSummary, setCartSummary] = useState({ items: [], subtotal: 0, shipping: 30000, total: 0 });
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(false);
  const [discountError, setDiscountError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const subtotal = storedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const shipping = subtotal > 0 ? 30000 : 0;
      setCartSummary({ items: storedCart, subtotal, shipping, total: subtotal + shipping });
    }
  }, []);

  const formatPrice = (price) => `${price.toLocaleString()} VND`;

  const handleApplyDiscount = () => {
    if (discountCode === "SALE10") {
      const discountAmount = cartSummary.subtotal * 0.1;
      const newTotal = cartSummary.total - discountAmount;
      setCartSummary({ ...cartSummary, total: newTotal });
      setAppliedDiscount(true);
      setDiscountError("");
    } else {
      setAppliedDiscount(false);
      setDiscountError("Mã giảm giá không hợp lệ");
    }
  };

  // const handlePlaceOrder = () => {
  //   const newOrder = {
  //     id: Date.now(),
  //     items: cartSummary.items,
  //     total: cartSummary.total,
  //     status: "đang xác nhận",
  //   };

  //   const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
  //   localStorage.setItem("orders", JSON.stringify([newOrder, ...existingOrders]));
  //   localStorage.removeItem("cart");
  //   setCartSummary({ items: [], subtotal: 0, shipping: 0, total: 0 });
  //   alert("Đơn hàng đã được đặt và đang chờ xác nhận!");
  // };

  const handlePlaceOrder = () => {
    const newOrder = {
      id: Date.now(),
      orderNumber: `OD-${Date.now()}`,
      date: new Date().toLocaleDateString("vi-VN"),
      status: "đang xác nhận",
      totalAmount: cartTotal,  // Tổng tiền giỏ hàng
      items: cartItems,        // Các sản phẩm trong giỏ hàng
    };
  
    // Lấy danh sách đơn hàng cũ từ localStorage
    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
  
    // Cập nhật danh sách đơn hàng mới
    const updatedOrders = [newOrder, ...existingOrders];
  
    // Lưu vào localStorage
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  
    // Xóa giỏ hàng sau khi đặt hàng
    localStorage.removeItem("cart");
  
    alert("Đơn hàng của bạn đã được đặt thành công!");
  };
  

  return (
    <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-3xl font-semibold text-pink-600 mb-4">Thanh toán</h1>
        <button className="flex items-center gap-2 text-pink-400 hover:text-blue-700 mx-auto">
          <ChevronLeft className="w-4 h-4" />
          <span>Quay lại giỏ hàng</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column - Forms */}
        <div className="space-y-8">
          {/* Thông Tin Liên Lạc */}
<div className="bg-white rounded-lg shadow p-6">
<h2 className="text-lg font-medium text-gray-900 mb-6">Thông Tin Liên Lạc</h2>
<div className="space-y-4">
  <div>
    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
      Địa Chỉ Email
    </label>
    <input
      type="email"
      id="email"
      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
      placeholder="Nhập email của bạn"
    />
  </div>
  <div>
    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
      Số Điện Thoại
    </label>
    <input
      type="tel"
      id="phone"
      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
      placeholder="Nhập số điện thoại của bạn"
    />
  </div>
</div>
</div>


         {/* Địa Chỉ Giao Hàng */}
<div className="bg-white rounded-lg shadow p-6">
<h2 className="text-lg font-medium text-gray-900 mb-6">Địa Chỉ Giao Hàng</h2>
<div className="space-y-4">
  <div className="grid grid-cols-2 gap-4">
    <div>
      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
        Tên
      </label>
      <input
        type="text"
        id="firstName"
         placeholder="Nhập tên của bạn"
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
      />
    </div>
    <div>
      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
        Họ
      </label>
      <input
        type="text"
        id="lastName"
         placeholder="Nhập họ của bạn"
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
      />
    </div>
  </div>
  <div>
    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
      Địa Chỉ
    </label>
    <input
      type="text"
      id="address"
      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
      placeholder="Số nhà, tên đường"
    />
  </div>
  <div className="grid grid-cols-2 gap-4">
    <div>
      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
        Thành Phố
      </label>
      <input
        type="text"
        id="city"
         placeholder="Nhập tên thành phố"
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
      />
    </div>
    <div>
      <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
        Quận/Huyện
      </label>
      <input
        type="text"
        id="district"
         placeholder="Nhập tên quận/huyện"
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
      />
    </div>
  </div>
</div>
</div>


          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Phương thức thanh toán</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <button
                  className={`flex-1 border rounded-lg p-4 text-left ${
                    paymentMethod === 'card'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-pink-600" />
                    <div>
                      <div className="font-medium text-black">Thẻ tín dụng/Ghi nợ</div>
                      <div className="text-sm text-gray-500">Thanh toán bằng Visa, Mastercard</div>
                    </div>
                  </div>
                </button>
                <button
                  className={`flex-1 border rounded-lg p-4 text-left ${
                    paymentMethod === 'cod'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setPaymentMethod('cod')}
                >
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-pink-600" />
                    <div>
                      <div className="font-medium text-black">COD</div>
                      <div className="text-sm text-gray-500">Thanh toán cho shipper khi nhận hàng</div>
                    </div>
                  </div>
                </button>
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-4 mt-6">
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Số thẻ thanh toán
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 text-black focus:ring-blue-500 focus:border-blue-500"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
                        Tháng hết hạn
                      </label>
                      <input
                        type="text"
                        id="expiry"
                        className="w-full border text-black border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                        Mã CVV
                      </label>
                      <input
                        type="password"
                        id="cvv"
                        maxLength="4"
pattern="\d{4}"
                        className="w-full border text-black border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
              {/* Right Column - Order Summary */}
              <div>
    <div className="bg-white rounded-lg shadow p-6 sticky top-8">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Thông tin đơn hàng</h2>
      <div className="space-y-4 mb-6">
        {cartSummary.items.map((item) => (
          <div key={item.sku_id} className="flex justify-between">
            <div>
              <p className="text-gray-900">{item.name}</p>
              <p className="text-sm text-gray-500">x {item.quantity}</p>
            </div>
            <div className="text-gray-900">{formatPrice(item.price * item.quantity)}</div>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
            placeholder="Discount code"
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 text-pink-700 focus:ring-pink-500 focus:border-pink-500"
          />
          <button
            onClick={handleApplyDiscount}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-gray-800"
          >
            Dùng mã
          </button>
        </div>
        {appliedDiscount && (
          <div className="flex items-center gap-2 text-green-600 mt-2">
            <Check className="w-4 h-4" />
            <span className="text-sm text-green-600">Đã áp dụng mã giảm giá</span>
          </div>
        )}
        {discountError && (
          <div className="flex items-center gap-2 text-red-600 mt-2">
            <span className="text-sm">{discountError}</span>
          </div>
        )}
      </div>

      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-gray-600">
          <span>Tổng tiền hàng</span>
          <span>{formatPrice(cartSummary.subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Phí vận chuyển</span>
          <span>{formatPrice(cartSummary.shipping)}</span>
        </div>
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between text-lg font-medium text-gray-900">
            <span>Tổng cộng</span>
            <span>{formatPrice(cartSummary.total)}</span>
          </div>  
        </div>
      </div>

      <button 
              onClick={handlePlaceOrder} 
              className="w-full mt-8 bg-pink-600 hover:bg-pink-400 text-white py-4 px-6 rounded-lg font-medium flex items-center justify-center gap-2"
            >
              Đặt hàng
            </button>

      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
        <Shield className="w-4 h-4" />
        <span>Bảo mật thanh toán tiêu chuẩn TLS</span>
        </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
