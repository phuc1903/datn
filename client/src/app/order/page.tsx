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
}

const OrderListPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("Tất cả");

  const statusMap: { [key: string]: string } = {
    waiting: "Chờ thanh toán",
    pending: "Cửa hàng đang xử lý",
    shipped: "Đã giao hàng",
    success: "Giao hàng thành công",
    cancel: "Đã hủy",
  };

  const statusIcons = {
    "Chờ thanh toán": <Package className="w-5 h-5 text-yellow-500" />,
    "Cửa hàng đang xử lý": <Package className="w-5 h-5 text-blue-500" />,
    "Đã giao hàng": <Truck className="w-5 h-5 text-orange-500" />,
    "Giao hàng thành công": <CheckCircle className="w-5 h-5 text-green-500" />,
    "Đã hủy": <XCircle className="w-5 h-5 text-red-500" />,
  };

  const statusFilters = [
    { label: "Tất cả", value: "Tất cả" },
    { label: "Chờ thanh toán", value: "Chờ thanh toán" },
    { label: "Cửa hàng đang xử lý", value: "Cửa hàng đang xử lý" },
    { label: "Đã giao hàng", value: "Đã giao hàng" },
    { label: "Giao hàng thành công", value: "Giao hàng thành công" },
    { label: "Đã hủy", value: "Đã hủy" },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userToken = Cookies.get("accessToken");
        const userEmail = Cookies.get("userEmail");

        if (!userToken || !userEmail) {
          router.push("/login");
          setIsLoading(false);
          return;
        }

        const url = `${API_BASE_URL}/users/orders`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Không thể lấy danh sách đơn hàng: ${response.status}`);
        }

        const result = await response.json();
        if (result.status !== "success") {
          throw new Error(result.message || "Không thể lấy danh sách đơn hàng");
        }

        const ordersData = result.data;
        if (!Array.isArray(ordersData)) {
          throw new Error("Dữ liệu đơn hàng không hợp lệ");
        }

        const fetchedOrders: Order[] = ordersData.map((order: any) => ({
          id: order.id?.toString() || "",
          orderNumber: order.order_number || `OD-${order.id}`,
          status: statusMap[order.status?.toLowerCase()] || "Không xác định",
          date: order.created_at
            ? new Date(order.created_at).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          totalAmount: order.total_amount || 0,
        }));

        setOrders(fetchedOrders);
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
    selectedStatus === "Tất cả"
      ? orders
      : orders.filter((order) => order.status === selectedStatus);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

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
                {filter.value !== "Tất cả" && statusIcons[filter.value]}
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
                        {statusIcons[order.status] || (
                          <Package className="w-5 h-5 text-gray-500" />
                        )}
                        <span>{order.status}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        Ngày đặt: {order.date}
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
              {selectedStatus === "Tất cả"
                ? "Bạn chưa có đơn hàng nào."
                : `Không có đơn hàng nào ở trạng thái "${selectedStatus}".`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderListPage;