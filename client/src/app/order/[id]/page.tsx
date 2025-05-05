"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Package, Truck, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { API_BASE_URL } from "@/config/config";

// Define types for variant values
interface VariantValue {
  value: string;
}

// Define types for product images
interface ProductImage {
  id: string;
  image_url: string;
  product_id: string;
}

// Define types for order item
interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  sku_id: string;
  product: {
    name: string;
  };
  // sku: {
  //   image_url?: string;
  //   variant_values?: VariantValue[];
  //   product?: {
  //     images?: ProductImage[];
  //   };
  // };
}

// Define order status types
type StatusType =
  | "Chờ thanh toán"
  | "Cửa hàng đang xử lý"
  | "Đã giao hàng"
  | "Giao hàng thành công"
  | "Đã hủy";

// Define order type
interface Order {
  id: string;
  orderNumber: string;
  status: StatusType;
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
interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  sku_id: string;
  product: {
    name: string;
  };
  sku: any;
  // sku: {
  //   image_url?: string;
  //   variant_values?: VariantValue[];
  // };
}

const OrderDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const statusMap: { [key: string]: StatusType } = {
    waiting: "Chờ thanh toán",
    pending: "Cửa hàng đang xử lý",
    shipped: "Đã giao hàng",
    success: "Giao hàng thành công",
    cancel: "Đã hủy",
  };

  const statusIcons: Record<StatusType, JSX.Element> = {
    "Chờ thanh toán": <Package className="w-5 h-5 text-yellow-500" />,
    "Cửa hàng đang xử lý": <Package className="w-5 h-5 text-blue-500" />,
    "Đã giao hàng": <Truck className="w-5 h-5 text-orange-500" />,
    "Giao hàng thành công": <CheckCircle className="w-5 h-5 text-green-500" />,
    "Đã hủy": <XCircle className="w-5 h-5 text-red-500" />,
  };

  const fetchOrderDetails = async () => {
    setIsLoading(true);
    setError(null);

    const userToken = Cookies.get("accessToken");
    const userEmail = Cookies.get("userEmail");

    if (!userToken || !userEmail) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Vui lòng đăng nhập để xem chi tiết đơn hàng.",
        confirmButtonText: "OK",
      }).then(() => {
        router.push("/login");
      });
      setIsLoading(false);
      return;
    }

    if (!id || typeof id !== "string" || id.trim() === "") {
      setError("Không tìm thấy ID đơn hàng.");
      setIsLoading(false);
      return;
    }

    try {
      const url = `${API_BASE_URL}/orders/${id}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Không thể lấy chi tiết đơn hàng: ${response.status}`);
      }

      const result = await response.json();

      if (result.status !== "success" || !result.data) {
        throw new Error(result.message || "Không thể lấy chi tiết đơn hàng");
      }

      const orderData = result.data;
      const fetchedOrder: Order = {
        id: orderData.id?.toString() ?? "",
        orderNumber: orderData.order_number ?? `OD-${orderData.id}`,
        status: statusMap[orderData.status?.toLowerCase()] ?? "Chờ thanh toán",
        date: orderData.created_at
          ? new Date(orderData.created_at).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        items: (orderData.items ?? []).map((item: any) => ({
          id: item.id?.toString() ?? "",
          quantity: item.quantity ?? 0,
          price: item.price ?? 0,
          sku_id: item.sku_id ?? "",
          product: {
            name: item.sku?.product?.name ?? "Sản phẩm không xác định",
          },
          sku: {
            image_url: item.sku?.product?.images?.[0]?.image_url ?? "/placeholder-image.jpg",
            variant_values: item.sku?.variant_values ?? [],
            product: {
              images: item.sku?.product?.images ?? [],
            },
          },
        })),
        shipping: orderData.shipping_cost ?? 0,
        totalAmount: orderData.total_amount ?? 0,
        discountAmount: orderData.discount_amount ?? 0,
        email: orderData.email ?? "",
        phoneNumber: orderData.phone_number ?? "",
        address: orderData.address ?? "",
        paymentMethod: orderData.payment_method ?? "Không xác định",
        fullName: orderData.full_name ?? "",
        provinceCode: orderData.province_code ?? "",
        districtCode: orderData.district_code ?? "",
        wardCode: orderData.ward_code ?? "",
        note: orderData.note ?? "",
        reason: orderData.reason ?? "",
      };

      setOrder(fetchedOrder);
    } catch (error: any) {
      console.error("Error fetching order details:", error);
      setError(error.message || "Không thể tải chi tiết đơn hàng. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [id, router]);

  const handleRetry = () => {
    fetchOrderDetails();
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const subtotal = order
    ? order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600">Đang tải chi tiết đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="inline-flex items-center px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Thử lại
          </button>
          <Link
            href="/order"
            className="mt-4 inline-flex items-center text-pink-600 hover:text-pink-800"
          >
            <ChevronLeft className="w-5 h-5" /> Quay lại lịch sử đơn hàng
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/order"
          className="flex items-center text-pink-600 hover:text-pink-800 mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" /> Quay lại lịch sử đơn hàng
        </Link>

        <h1 className="text-2xl font-semibold mb-8 text-pink-500">
          Chi Tiết Đơn Hàng #{order.orderNumber}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items and Status */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  {statusIcons[order.status] ?? <Package className="w-5 h-5 text-gray-500" />}
                  <span className="text-lg font-medium text-gray-700">{order.status}</span>
                  <span className="text-sm text-gray-500">({order.date})</span>
                </div>

                {order.items.length > 0 ? (
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="w-24 h-24 flex-shrink-0">
                          <Image
                            src={item.sku.image_url ?? "/placeholder-image.jpg"}
                            alt={item.product.name}
                            width={96}
                            height={96}
                            className="object-cover rounded-md"
                            onError={(e) => (e.currentTarget.src = "/placeholder-image.jpg")}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-600">
                            {item.sku.variant_values?.length > 0
                              ? item.sku.variant_values.map((v: any) => v.value).join(", ")
                              : "Không có biến thể"}
                          </p>
                          <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                        </div>
                        <div className="text-gray-900 font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Không có sản phẩm trong đơn hàng này.
                  </p>
                )}
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Thông Tin Giao Hàng</h2>
                <div className="text-sm text-gray-700 space-y-2">
                  <p>
                    <span className="font-medium">Tên: </span>
                    {order.fullName || "Không xác định"}
                  </p>
                  <p>
                    <span className="font-medium">Email: </span>
                    {order.email || "Không xác định"}
                  </p>
                  <p>
                    <span className="font-medium">Số điện thoại: </span>
                    {order.phoneNumber || "Không xác định"}
                  </p>
                  <p>
                    <span className="font-medium">Địa chỉ: </span>
                    {order.address
                      ? `${order.address}, ${order.wardCode}, ${order.districtCode}, ${order.provinceCode}`
                      : "Không xác định"}
                  </p>
                  <p>
                    <span className="font-medium">Ghi chú: </span>
                    {order.note || "Không có ghi chú"}
                  </p>
                  {order.reason && (
                    <p>
                      <span className="font-medium">Lý do: </span>
                      {order.reason}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Tóm Tắt Đơn Hàng</h2>
                <div className="space-y-4">
                  <div className="flex justify-between textzone-600">
                    <span>Tạm tính</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {/* <div className="flex justify-between text-base text-gray-600">
                    <span>Phí vận chuyển</span>
                    <span>{formatPrice(order.shipping)}</span>
                  </div> */}
                  <div className="flex justify-between text-base text-gray-600">
                    <span>Giảm giá</span>
                    <span>{formatPrice(order.discountAmount)}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-medium text-gray-900">
                      <span>Tổng cộng</span>
                      <span>{formatPrice(order.totalAmount)}</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="font-medium">Phương thức thanh toán: </span>
                    <span>
                      {order.paymentMethod.toLowerCase() === "cod"
                        ? "Thanh toán khi nhận hàng"
                        : order.paymentMethod.toLowerCase() === "bank"
                        ? "Chuyển khoản (Momo)"
                        : order.paymentMethod}
                    </span>
                  </div>
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