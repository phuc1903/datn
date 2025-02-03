"use client";
import React, { useState } from "react";
import { ChevronRight, Package, Truck, CheckCircle, XCircle } from "lucide-react";

const OrderHistoryPage = () => {
  // Mock order data with different statuses
  const [orders, setOrders] = useState([
    {
      id: 1,
      orderNumber: "OD-2024-0001",
      date: "15/01/2024",
      status: "đang xác nhận",
      totalAmount: 1158000,
      items: [
        {
          name: "Intensive Moisturizing Cream",
          brand: "SkinCare Plus",
          quantity: 2,
          price: 459000
        },
        {
          name: "Vitamin C Serum",
          brand: "Glow Labs", 
          quantity: 1,
          price: 699000
        }
      ]
    },
    {
      id: 2,
      orderNumber: "OD-2024-0002", 
      date: "10/01/2024",
      status: "đã giao",
      totalAmount: 899000,
      items: [
        {
          name: "Hyaluronic Acid Serum",
          brand: "Hydrate Pro",
          quantity: 1,
          price: 899000
        }
      ]
    },
    {
      id: 3,
      orderNumber: "OD-2024-0003",
      date: "05/01/2024", 
      status: "đã hủy",
      totalAmount: 599000,
      items: [
        {
          name: "Collagen Supplement",
          brand: "Beauty Boost",
          quantity: 1,
          price: 599000
        }
      ]
    }
  ]);

  // Status icon mapping
  const statusIcons = {
    "đang xác nhận": <Package className="w-5 h-5 text-yellow-500" />,
    "đang đóng gói": <Package className="w-5 h-5 text-blue-500" />,
    "đang giao hàng": <Truck className="w-5 h-5 text-orange-500" />,
    "đã giao": <CheckCircle className="w-5 h-5 text-green-500" />,
    "đã hủy": <XCircle className="w-5 h-5 text-red-500" />
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const [activeStatus, setActiveStatus] = useState("tất cả");
  const statusList = ["tất cả", "đang xác nhận", "đang đóng gói", "đang giao hàng", "đã giao", "đã hủy"];

  const filteredOrders = activeStatus === "tất cả" 
    ? orders 
    : orders.filter(order => order.status === activeStatus);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-8 text-pink-500">Lịch Sử Đơn Hàng</h1>

        {/* Status Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {statusList.map(status => (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={`px-3 py-2 rounded-lg text-sm ${
                activeStatus === status 
                  ? "bg-pink-600 text-white" 
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Order List */}
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div 
              key={order.id} 
              className="bg-white  text-black rounded-lg shadow p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  {statusIcons[order.status]}
                  <span className="font-medium text-gray-700">{order.status}</span>
                </div>
                <span className="text-sm text-gray-500">
                  Mã Đơn: {order.orderNumber}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-sm text-gray-500 ml-2">x{item.quantity}</span>
                    </div>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center border-t pt-4">
                <span className="text-sm text-gray-500">{order.date}</span>
                <div className="flex gap-2">
                  <span className="font-medium">Tổng Cộng:</span>
                  <span className="text-pink-600">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                {order.status !== "đã hủy" && order.status !== "đã giao" && (
                  <button className="text-pink-600 hover:text-pink-800">
                    Hủy Đơn
                  </button>
                )}
                <button className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700">
                  Chi Tiết Đơn Hàng
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            Không có đơn hàng nào trong trạng thái này
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;