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

  const statusIcons: { [key: string]: React.JSX.Element } = {
    "Chờ thanh toán": <Package className="w-5 h-5 text-yellow-500" />,
    "Cửa hàng đang xử lý": <Package className="w-5 h-5 text-blue-500" />,
    "Đã giao hàng": <Truck className="w-5 h-5 text-orange-500" />,
    "Giao hàng thành công": <CheckCircle className="w-5 h-5 text-green-500" />,
    "Đã hủy": <XCircle className="w-5 h-5 text-red-500" />,
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