"use client";
import React, { useState, useEffect } from "react";
import { ChevronRight, Package, Truck, CheckCircle, XCircle } from "lucide-react";
import Swal from "sweetalert2";

const OrderHistoryPage = () => {
  // Load danh sách đơn hàng từ localStorage
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(storedOrders);
  }, []);

  // Hàm lưu đơn hàng vào localStorage
  const saveOrdersToLocalStorage = (updatedOrders) => {
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  // Hàm hủy đơn hàng
  const handleCancelOrder = (orderId) => {
    Swal.fire({
      title: "Bạn có chắc chắn muốn hủy đơn hàng?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hủy đơn",
      cancelButtonText: "Giữ lại",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedOrders = orders.map(order =>
          order.id === orderId ? { ...order, status: "đã hủy" } : order
        );
        saveOrdersToLocalStorage(updatedOrders);
        Swal.fire("Đã hủy!", "Đơn hàng của bạn đã bị hủy.", "success");
      }
    });
  };

  // Danh sách trạng thái
  const statusList = ["tất cả", "đang xác nhận", "đang đóng gói", "đang giao hàng", "đã giao", "đã hủy"];
  const [activeStatus, setActiveStatus] = useState("tất cả");

  // Lọc đơn hàng theo trạng thái
  const filteredOrders = activeStatus === "tất cả"
    ? orders
    : orders.filter(order => order.status === activeStatus);

  // Biểu tượng trạng thái
  const statusIcons = {
    "đang xác nhận": <Package className="w-5 h-5 text-yellow-500" />,
    "đang đóng gói": <Package className="w-5 h-5 text-blue-500" />,
    "đang giao hàng": <Truck className="w-5 h-5 text-orange-500" />,
    "đã giao": <CheckCircle className="w-5 h-5 text-green-500" />,
    "đã hủy": <XCircle className="w-5 h-5 text-red-500" />
  };

  // Định dạng tiền tệ
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-8 text-pink-500">Lịch Sử Đơn Hàng</h1>

        {/* Bộ lọc trạng thái */}
        <div className="mb-6 flex flex-wrap gap-2">
          {statusList.map(status => (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={`px-3 py-2 rounded-lg text-sm ${activeStatus === status
                ? "bg-pink-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Danh sách đơn hàng */}
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div
              key={order.id}
              className="bg-white text-black rounded-lg shadow p-6 hover:shadow-md transition-shadow"
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
                      <div className="text-sm text-gray-600">
                        {item.variants && item.variants.length > 0
                          ? item.variants.map((v) => `${v.name}: ${v.value}`).join(", ")
                          : "Không có biến thể"}
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
                    <span className="font-medium">{formatPrice(order.shipping || 30000)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-base font-semibold">
                    <span className="text-gray-700">Tổng Cộng:</span>
                    <span className="text-pink-600">{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>
              </div>


              <div className="mt-4 flex justify-end gap-2">
                {/* Nút hủy đơn hàng */}
                {order.status !== "đã hủy" && order.status !== "đã giao" && (
                  <button
                    className="text-pink-600 hover:text-pink-800"
                    onClick={() => handleCancelOrder(order.id)}
                  >
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
