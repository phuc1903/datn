"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { API_BASE_URL } from "@/config/config";

// Định nghĩa kiểu cho variant_values
interface VariantValue {
  value: string;
}

// Định nghĩa kiểu cho sản phẩm trong đơn hàng
interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
  };
  sku: {
    image_url?: string;
    variant_values?: VariantValue[];
  };
}

// Định nghĩa kiểu cho đơn hàng
interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  date: string;
  items: OrderItem[];
  shipping: number;
  totalAmount: number;
  discountAmount: number;
  email: string;
  phoneNumber: string;
  address: string;
  paymentMethod: string;
  fullName: string;
  provinceCode: string;
  districtCode: string;
  wardCode: string;
  note: string;
  reason: string;
}

type OrderStatus = "Chờ thanh toán" | "Cửa hàng đang xử lý" | "Đã giao hàng" | "Giao hàng thành công" | "Đã hủy";

const statusIcons: Record<OrderStatus, JSX.Element> = {
  "Chờ thanh toán": <Clock className="w-5 h-5 text-yellow-500" />,
  "Cửa hàng đang xử lý": <Package className="w-5 h-5 text-blue-500" />,
  "Đã giao hàng": <Truck className="w-5 h-5 text-green-500" />,
  "Giao hàng thành công": <CheckCircle className="w-5 h-5 text-green-500" />,
  "Đã hủy": <XCircle className="w-5 h-5 text-red-500" />,
};

const OrderDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const statusMap: Record<string, OrderStatus> = {
    pending: "Chờ thanh toán",
    processing: "Cửa hàng đang xử lý",
    shipping: "Đã giao hàng",
    completed: "Giao hàng thành công",
    cancel: "Đã hủy",
  };

  useEffect(() => {
    console.log("Order ID:", id);

    const fetchOrderDetails = async () => {
      const userToken = Cookies.get("accessToken");
      const userData = Cookies.get("userData");

      if (!userToken || !userData) {
        console.log("Missing token or userData, redirecting to login");
        router.push("/login");
        setIsLoading(false);
        return;
      }

      try {
        const parsedUserData = JSON.parse(userData);
        const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Không thể lấy chi tiết đơn hàng: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log("API Response:", result);

        if (result.status !== "success") {
          throw new Error(result.message || "Không thể lấy chi tiết đơn hàng");
        }

        const orderData = result.data;
        if (!orderData) {
          throw new Error("Đơn hàng không tồn tại");
        }

        const status = statusMap[orderData.status?.toLowerCase()] || "Chờ thanh toán";
        
        const fetchedOrder: Order = {
          id: orderData.id?.toString() || "",
          orderNumber: orderData.order_number || `OD-${orderData.id}`,
          status: status,
          date: orderData.created_at
            ? new Date(orderData.created_at).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          items: (orderData.items || []).map((item: any) => ({
            id: item.id?.toString() || "",
            quantity: item.quantity || 0,
            price: item.price || 0,
            product: {
              name: item.sku?.product?.name || "Sản phẩm không xác định",
            },
            sku: {
              image_url: item.sku?.image_url || "/placeholder-image.jpg",
              variant_values: item.sku?.variant_values || [],
            },
          })),
          shipping: orderData.shipping_cost || 0,
          totalAmount: orderData.total_amount || 0,
          discountAmount: orderData.discount_amount || 0,
          email: orderData.email || "",
          phoneNumber: orderData.phone_number || "",
          address: orderData.address || "",
          paymentMethod: orderData.payment_method || "Không xác định",
          fullName: orderData.full_name || "",
          provinceCode: orderData.province_code || "",
          districtCode: orderData.district_code || "",
          wardCode: orderData.ward_code || "",
          note: orderData.note || "",
          reason: orderData.reason || "",
        };

        setOrder(fetchedOrder);
      } catch (error: any) {
        console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: error.message || "Không thể tải chi tiết đơn hàng",
          confirmButtonText: "OK",
        });
        setOrder(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (id && typeof id === "string" && id.trim() !== "") {
      fetchOrderDetails();
    } else {
      setIsLoading(false);
      setOrder(null);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không tìm thấy ID đơn hàng. Quay lại lịch sử đơn hàng.",
        confirmButtonText: "OK",
      }).then(() => {
        router.push("/order");
      });
    }
  }, [id, router, params]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const subtotal = order
    ? order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : 0;

  if (isLoading) {
    return <div className="text-center py-8">Đang tải chi tiết đơn hàng...</div>;
  }

  if (!order) {
    return <div className="text-center py-8">Không tìm thấy đơn hàng.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <Link
          href="/order"
          className="flex items-center text-pink-600 hover:text-pink-800 mb-6"
        >
          <ChevronLeft className="w-5 h-5" /> Quay lại lịch sử đơn hàng
        </Link>

        <h1 className="text-2xl font-semibold mb-8 text-pink-500">
          Chi Tiết Đơn Hàng #{order.orderNumber}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  {statusIcons[order.status] || <Package className="w-5 h-5 text-gray-500" />}
                  <span className="text-lg font-medium text-gray-700">{order.status}</span>
                  <span className="text-sm text-gray-500">({order.date})</span>
                </div>

                {order.items.length > 0 ? (
                  <div className="space-y-4 mb-6">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center"
                      >
                        <div className="w-24 h-24 flex-shrink-0">
                          <Image
                            src={item.sku.image_url || "/placeholder-image.jpg"}
                            alt={item.product.name || "Product"}
                            width={96}
                            height={96}
                            className="object-cover rounded-md"
                            onError={(e) => (e.currentTarget.src = "/placeholder-image.jpg")}
                          />
                        </div>
                        <div className="flex-1 px-4">
                          <p className="text-gray-900">
                            {item.product.name || "Unknown Product"}
                          </p>
                          <div className="text-sm text-gray-600">
                            {item.sku?.variant_values && item.sku.variant_values.length > 0
                              ? item.sku.variant_values.map((v) => v.value).join(", ")
                              : "Không có biến thể"}
                          </div>
                          <p className="text-sm text-gray-500">x {item.quantity || 0}</p>
                        </div>
                        <div className="text-gray-900">
                          {formatPrice((item.price || 0) * (item.quantity || 0))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-pink-500">
                    Không có sản phẩm trong đơn hàng này
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow mt-6 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Thông Tin Giao Hàng</h2>
              <div className="text-sm text-gray-700 space-y-1">
                <p>
                  <span className="font-medium">Tên: </span>
                  {order.fullName}
                </p>
                <p>
                  <span className="font-medium">Email: </span>
                  {order.email}
                </p>
                <p>
                  <span className="font-medium">Số điện thoại: </span>
                  {order.phoneNumber}
                </p>
                <p>
                  <span className="font-medium">Địa chỉ: </span>
                  {order.address}, {order.wardCode}, {order.districtCode}, {order.provinceCode}
                </p>
                <p>
                  <span className="font-medium">Ghi chú: </span>
                  {order.note || "Không có ghi chú"}
                </p>
                <p>
                  <span className="font-medium">Lý do: </span>
                  {order.reason || "Không có lý do"}
                </p>
              </div>
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
                  <span>Giảm Giá</span>
                  <span>{formatPrice(order.discountAmount)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-medium text-gray-900">
                    <span>Tổng Cộng</span>
                    <span>{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="font-medium">Phương thức thanh toán: </span>
                  <span>
                    {order.paymentMethod.toLowerCase() === "cod"
                      ? "Tiền mặt"
                      : order.paymentMethod.toLowerCase() === "bank"
                      ? "Momo"
                      : order.paymentMethod}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;