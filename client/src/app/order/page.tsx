"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Package, Truck, CheckCircle, XCircle } from "lucide-react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import Link from "next/link";
import { API_BASE_URL } from "@/config/config";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  date: string;
  totalAmount: number;
  items: {
    product: {
      name: string;
      price: number;
    };
    quantity: number;
  }[];
}

const OrderListPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const statusMap: { [key: string]: string } = {
    waiting: "Chờ thanh toán",
    pending: "Cửa hàng đang xử lý",
    shipped: "Đã giao hàng",
    success: "Giao hàng thành công",
    cancel: "Đã hủy",
  };

  const statusIcons: Record<string, JSX.Element> = {
    waiting: <Package className="w-5 h-5 text-yellow-500" />,
    pending: <Package className="w-5 h-5 text-blue-500" />,
    shipped: <Truck className="w-5 h-5 text-orange-500" />,
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    cancel: <XCircle className="w-5 h-5 text-red-500" />,
  };

  const statusFilters = [
    { label: "Tất cả", value: "all" },
    { label: "Chờ thanh toán", value: "waiting" },
    { label: "Cửa hàng đang xử lý", value: "pending" },
    { label: "Đã giao hàng", value: "shipped" },
    { label: "Giao hàng thành công", value: "success" },
    { label: "Đã hủy", value: "cancel" },
  ];

  const formatDate = (dateString: string) => {
    if (!dateString) return "Chưa có ngày";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Ngày không hợp lệ";
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Ngày không hợp lệ";
    }
  };

  const formatPrice = (price: number | string) => {
    if (!price) return "0 ₫";
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numericPrice)) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(numericPrice);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const userToken = Cookies.get("accessToken");
      const userData = Cookies.get("userData");

      if (!userToken || !userData) {
        router.push("/login");
        return;
      }

      try {
        const parsedUserData = JSON.parse(userData);
        const response = await fetch(`${API_BASE_URL}/users/orders`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Không thể lấy danh sách đơn hàng: ${response.status}`);
        }

        const result = await response.json();
        if (result.data) {
          const formattedOrders = result.data.map((order: any) => ({
            ...order,
            date: order.created_at || order.date,
            totalAmount: order.total_amount || order.totalAmount
          }));
          setOrders(formattedOrders);
        }
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: error.message || "Không thể tải danh sách đơn hàng",
        });
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  const filteredOrders =
    selectedStatus === "all"
      ? orders
      : orders.filter((order) => order.status === selectedStatus);

  if (isLoading) {
    return <div className="text-center py-8">Đang tải danh sách đơn hàng...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-6 text-pink-500">Lịch Sử Đơn Hàng</h1>

        <div className="mb-6">
          <div className="flex flex-nowrap gap-2 overflow-x-auto">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedStatus(filter.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  selectedStatus === filter.value
                    ? "bg-pink-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {filter.value !== "all" && statusIcons[filter.value]}
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 text-black">
          {filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-4 border-b last:border-b-0"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="font-medium block">
                        Mã đơn hàng: {order.orderNumber}
                      </span>
                      <div className="text-sm text-gray-600 flex items-center gap-1">
                        {statusIcons[order.status]}
                        <span>{statusMap[order.status]}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        Ngày đặt: {formatDate(order.date)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-medium block">
                      {formatPrice(order.totalAmount)}
                    </span>
                    <Link
                      href={`/order/${order.id}`}
                      className="text-pink-600 hover:text-pink-800 text-sm"
                    >
                      Xem sản phẩm
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              {selectedStatus === "all"
                ? "Bạn chưa có đơn hàng nào."
                : `Không có đơn hàng nào ở trạng thái "${statusMap[selectedStatus]}".`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderListPage;