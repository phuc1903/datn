"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Star } from "lucide-react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import Link from "next/link";
import { API_BASE_URL } from "@/config/config";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  sku_id: string;
  product: {
    name: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  date: string;
  totalAmount: number;
  isReviewed: boolean;
  items: OrderItem[];
  reviews?: Review[];
}

interface Review {
  id: string;
  sku_id: string;
  user_id: string;
  order_id: string;
  rating: number;
  comment: string;
  status: string;
  created_at: string;
  updated_at: string;
  sku?: {
    product?: {
      name: string;
    };
  };
}

const FeedbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refresh = searchParams.get("refresh") === "true";
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedTab, setSelectedTab] = useState<string>("Chưa đánh giá");

  const statusMap: { [key: string]: string } = {
    success: "Giao hàng thành công",
  };

  const statusIcons = {
    "Giao hàng thành công": <CheckCircle className="w-5 h-5 text-green-500" />,
  };

  const tabs = [
    { label: "Chưa đánh giá", value: "Chưa đánh giá" },
    { label: "Đã đánh giá", value: "Đã đánh giá" },
  ];

  const fetchData = async () => {
    try {
      const userToken = Cookies.get("accessToken");
      const userEmail = Cookies.get("userEmail");

      if (!userToken || !userEmail) {
        router.push("/login");
        setIsLoading(false);
        return;
      }

      // Fetch orders
      const ordersUrl = `${API_BASE_URL}/users/orders`;
      const ordersResponse = await fetch(ordersUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (!ordersResponse.ok) {
        const errorText = await ordersResponse.text();
        throw new Error(`Không thể lấy danh sách đơn hàng: ${ordersResponse.status} - ${errorText}`);
      }

      const ordersResult = await ordersResponse.json();
      if (ordersResult.status !== "success") {
        throw new Error(ordersResult.message || "Không thể lấy danh sách đơn hàng");
      }

      const ordersData = ordersResult.data;
      if (!Array.isArray(ordersData)) {
        throw new Error("Dữ liệu đơn hàng không hợp lệ");
      }

      // Fetch reviews
      const reviewsUrl = `${API_BASE_URL}/product_feedbacks/getAllOrderItem`;
      const reviewsResponse = await fetch(reviewsUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (!reviewsResponse.ok) {
        const errorText = await reviewsResponse.text();
        throw new Error(`Không thể lấy danh sách đánh giá: ${reviewsResponse.status} - ${errorText}`);
      }

      const reviewsResult = await reviewsResponse.json();
      if (reviewsResult.status !== "success") {
        throw new Error(reviewsResult.message || "Không thể lấy danh sách đánh giá");
      }

      const reviewsData: Review[] = reviewsResult.data;

      // Map orders and attach reviews
      const fetchedOrders: Order[] = ordersData
        .filter((order: any) => order.status?.toLowerCase() === "success")
        .map((order: any) => {
          const orderReviews = reviewsData.filter(
            (review: Review) => review.order_id === order.id?.toString()
          );
          // Check if there is at least one review with status "active"
          const hasActiveReview = orderReviews.some((review) => review.status === "active");
          return {
            id: order.id?.toString() || "",
            orderNumber: order.order_number || `OD-${order.id}`,
            status: statusMap[order.status?.toLowerCase()] || "Không xác định",
            date: order.created_at
              ? new Date(order.created_at).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0],
            totalAmount: order.total_amount || 0,
            isReviewed: hasActiveReview, // Only set to true if there’s an active review
            items: (order.items || []).map((item: any) => ({
              id: item.id?.toString() || "",
              quantity: item.quantity || 0,
              price: item.price || 0,
              sku_id: item.sku?.id?.toString() || "",
              product: {
                name: item.sku?.product?.name || "Sản phẩm không xác định",
              },
            })),
            reviews: orderReviews,
          };
        });

      setOrders(fetchedOrders);
    } catch (error: any) {
      console.error("Fetch data error:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.message || "Không thể tải dữ liệu",
        confirmButtonText: "OK",
      });
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  // Refetch data when redirected with refresh=true
  useEffect(() => {
    if (refresh) {
      fetchData();
      // Clear the query parameter to prevent continuous refetching
      router.replace("/feedback", undefined, { shallow: true });
    }
  }, [refresh, router]);

  const filteredOrders =
    selectedTab === "Chưa đánh giá"
      ? orders.filter((order) => !order.isReviewed)
      : orders.filter((order) => order.isReviewed);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  if (isLoading) {
    return <div className="text-center py-8">Đang tải danh sách phản hồi...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-6 text-pink-500">Phản Hồi Đơn Hàng</h1>

        <div className="mb-6">
          <div className="flex flex-nowrap gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSelectedTab(tab.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  selectedTab === tab.value
                    ? "bg-pink-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 text-black">
          {filteredOrders.length > 0 ? (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <div key={order.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="font-medium block">Mã đơn hàng: {order.orderNumber}</span>
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          {statusIcons[order.status]}
                          <span>{order.status}</span>
                        </div>
                        <span className="text-sm text-gray-500">Ngày đặt: {order.date}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-medium block">{formatPrice(order.totalAmount)}</span>
                      {selectedTab === "Chưa đánh giá" ? (
                        <Link
                          href={`/feedback/${order.id}`}
                          className="text-pink-600 hover:text-pink-800 text-sm flex items-center gap-1"
                        >
                          <Star className="w-4 h-4" /> Đánh giá
                        </Link>
                      ) : (
                        <Link
                          href={`/feedback/${order.id}`}
                          className="text-pink-600 hover:text-pink-800 text-sm"
                        >
                          Xem đánh giá
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Display items and reviews */}
                  {order.items.length > 0 ? (
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="border-t pt-4">
                          <div className="flex items-center gap-4 mb-4">
                            <div>
                              <span className="font-medium block">{item.product.name}</span>
                              <span className="text-sm text-gray-500">Số lượng: {item.quantity}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      {/* Display reviews for "Đã đánh giá" tab */}
                      {selectedTab === "Đã đánh giá" && order.reviews && order.reviews.length > 0 ? (
                        <div className="space-y-4">
                          {order.reviews
                            .filter((review) => review.status === "active")
                            .map((review) => (
                              <div key={review.id} className="border-t pt-4">
                                <div className="mb-2">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Đánh giá sao
                                  </label>
                                  <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className={`w-6 h-6 ${
                                          star <= review.rating
                                            ? "text-yellow-400 fill-yellow-400"
                                            : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nhận xét
                                  </label>
                                  <p className="text-sm text-gray-600">{review.comment || "Không có nhận xét"}</p>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  Đánh giá vào: {new Date(review.created_at).toLocaleString("vi-VN")}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Cập nhật vào: {new Date(review.updated_at).toLocaleString("vi-VN")}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Trạng thái: {review.status}
                                </p>
                              </div>
                            ))}
                        </div>
                      ) : selectedTab === "Đã đánh giá" ? (
                        <p className="text-gray-500 text-sm">Chưa có đánh giá cho đơn hàng này.</p>
                      ) : null}
                    </div>
                  ) : (
                    <p className="text-gray-500">Không có sản phẩm trong đơn hàng.</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              {selectedTab === "Chưa đánh giá"
                ? "Bạn chưa có đơn hàng nào cần đánh giá."
                : "Bạn chưa có đơn hàng nào đã đánh giá."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;