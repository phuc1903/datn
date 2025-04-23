"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Package, Truck, CheckCircle, XCircle,EyeIcon,XIcon } from "lucide-react";
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

  const statusIcons: { [key: string]: React.JSX.Element } = {
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

  const handleCancelOrder = async (orderId: string) => {
    try {
      const userToken = Cookies.get("accessToken");
      if (!userToken) {
        router.push("/login");
        return;
      }

      // Show confirmation dialog with input for reason
      const { value: reason } = await Swal.fire({
        title: "Hủy đơn hàng",
        input: "textarea",
        inputLabel: "Lý do hủy đơn hàng",
        inputPlaceholder: "Vui lòng nhập lý do hủy đơn hàng...",
        inputAttributes: {
          "aria-label": "Lý do hủy",
          maxlength: "255",
        },
        showCancelButton: true,
        confirmButtonText: "Xác nhận hủy",
        cancelButtonText: "Hủy bỏ",
        inputValidator: (value) => {
          if (!value) {
            return "Vui lòng nhập lý do hủy đơn hàng!";
          }
          if (value.length > 255) {
            return "Lý do không được vượt quá 255 ký tự!";
          }
          return null;
        },
      });

      if (!reason) return;

      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể hủy đơn hàng");
      }

      const result = await response.json();
      if (result.status !== "success") {
        throw new Error(result.message || "Không thể hủy đơn hàng");
      }

      // Update the order status locally
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? { ...order, status: "Đã hủy" }
            : order
        )
      );

      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Đơn hàng đã được hủy thành công!",
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.message || "Không thể hủy đơn hàng",
      });
    }
  };

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
                  <div className="text-right flex flex-col items-end gap-2">
  <span className="font-medium block">
    {formatPrice(order.totalAmount)}
  </span>
  <div className="relative group">
    <Link
      href={`/order/${order.id}`}
      className="text-pink-600 hover:text-pink-800"
    >
      <EyeIcon className="w-5 h-5" />
    </Link>
    <span className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      Xem sản phẩm
    </span>
  </div>
  {order.status === "Cửa hàng đang xử lý" && (
    <div className="relative group">
      <button
        onClick={() => handleCancelOrder(order.id)}
        className="text-red-600 hover:text-red-800"
      >
        <XCircle className="w-5 h-5 text-red-500" />
      </button>
      <span className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        Hủy đơn
      </span>
    </div>
  )}
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