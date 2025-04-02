import React, { useState } from "react";
import { Package, Truck, CheckCircle, XCircle } from "lucide-react";
import { Order } from "@/types/profile";

interface OrdersProps {
  orders: Order[];
  onCancel: (id: number) => void;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

const Orders = ({ orders, onCancel }: OrdersProps) => {
  const [activeStatus, setActiveStatus] = useState("tất cả");
  const statusList = ["Tất cả", "Đang xác nhận", "Đang đóng gói", "Đang giao hàng", "Đã giao", "Đã hủy"];
  const statusIcons = {
    "Đang xác nhận": <Package className="w-5 h-5 text-yellow-500" />,
    "Đang đóng gói": <Package className="w-5 h-5 text-blue-500" />,
    "Đang giao hàng": <Truck className="w-5 h-5 text-orange-500" />,
    "Đã giao": <CheckCircle className="w-5 h-5 text-green-500" />,
    "Đã hủy": <XCircle className="w-5 h-5 text-red-500" />,
  };

  const filteredOrders =
    activeStatus === "tất cả" ? orders : orders.filter((order) => order.status.toLowerCase() === activeStatus.toLowerCase());

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-pink-500">Lịch Sử Đơn Hàng</h2>
      <div className="mb-6 flex flex-wrap gap-2">
        {statusList.map((status) => (
          <button
            key={status}
            onClick={() => setActiveStatus(status.toLowerCase())}
            className={`px-3 py-2 rounded-lg text-sm ${
              activeStatus === status.toLowerCase() ? "bg-pink-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {status}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white text-black rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                {statusIcons[order.status as keyof typeof statusIcons]}
                <span className="font-medium text-gray-700">{order.status}</span>
              </div>
              <span className="text-sm text-gray-500">Mã Đơn: {order.orderNumber}</span>
            </div>
            <div className="space-y-2 mb-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <div className="text-sm text-gray-600">
                      {item.variants?.map((v) => `${v.name}: ${v.value}`).join(", ") || "Không có biến thể"}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">x{item.quantity}</span>
                  </div>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center border-t pt-4 text-gray-700">
              <span className="text-sm text-gray-500">{order.date}</span>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Phí Vận Chuyển:</span>
                  <span className="font-medium">{formatPrice(order.shipping)}</span>
                </div>
                <div className="flex items-center gap-2 text-base font-semibold">
                  <span className="text-gray-700">Tổng Cộng:</span>
                  <span className="text-pink-600">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              {order.status !== "Đã hủy" && order.status !== "Đã giao" && (
                <button className="text-pink-600 hover:text-pink-800" onClick={() => onCancel(order.id)}>
                  Hủy Đơn
                </button>
              )}
              <button className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700">Chi Tiết Đơn Hàng</button>
            </div>
          </div>
        ))}
        {!filteredOrders.length && <div className="text-center text-gray-500 py-8">Không có đơn hàng nào</div>}
      </div>
    </div>
  );
};

export default React.memo(Orders); 