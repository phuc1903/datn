"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Star, PenSquare, Check } from "lucide-react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import Link from "next/link";
import Image from "next/image";
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
  isCombo?: boolean; // Thêm thuộc tính để nhận diện combo
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
    image_url?: string;
    variant_values?: { variant: { name: string }; value: string }[];
  };
}

const FeedbackContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refresh = searchParams.get("refresh") === "true";
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"pending" | "reviewed">("pending");

  const statusMap: { [key: string]: string } = {
    success: "Giao hàng thành công",
  };

  const statusIcons: { [key: string]: React.JSX.Element } = {
    "Giao hàng thành công": <CheckCircle className="w-5 h-5 text-green-500" />,
  };

  const fetchWithRetry = async (url: string, options: RequestInit, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(timeoutId);

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          throw new Error(
            `Response không phải JSON (status: ${response.status}): ${text.slice(0, 100)}...`
          );
        }

        return response;
      } catch (error) {
        if (i === retries - 1) throw error;
        console.warn(`Retrying fetch (${i + 1}/${retries}) for ${url}...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    throw new Error("Max retries reached");
  };

  const fetchData = async () => {
    try {
      const userToken = Cookies.get("accessToken");
      const userData = Cookies.get("userData");

      if (!userToken || !userData) {
        router.push("/login");
        setIsLoading(false);
        return;
      }

      const parsedUserData = JSON.parse(userData);
      const ordersUrl = `${API_BASE_URL}/users/orders`;
      const ordersResponse = await fetchWithRetry(ordersUrl, {
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
      const ordersData = ordersResult.data;

      const userReviewsUrl = `${API_BASE_URL}/users`;
      const reviewsResponse = await fetchWithRetry(userReviewsUrl, {
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
      const reviewsData: Review[] = reviewsResult.data?.product_feedbacks || [];
      const userId = reviewsResult.data?.id?.toString(); // Lấy user_id từ API /users
      if (!userId) {
        throw new Error("Không thể lấy user_id từ API");
      }
      setReviews(reviewsData);

      const fetchedOrders: Order[] = ordersData
        .filter((order: any) => order.status?.toLowerCase() === "success")
        .map((order: any) => {
          const orderReviews = reviewsData.filter(
            (review: Review) => review.order_id === order.id?.toString()
          );
          const items = (order.items || []).map((item: any) => ({
            id: item.id?.toString() || "",
            quantity: item.quantity || 0,
            price: item.price || 0,
            sku_id: item.sku?.id?.toString() || "",
            product: {
              name: item.sku?.product?.name || "Sản phẩm không xác định",
            },
          }));

          // Kiểm tra xem đơn hàng đã có đánh giá nào từ user_id hiện tại hay chưa
          const isReviewed = orderReviews.some(
            (review: Review) => review.user_id === userId && review.status === "active"
          );

          return {
            id: order.id?.toString() || "",
            orderNumber: order.order_number || `OD-${order.id}`,
            status: statusMap[order.status?.toLowerCase()] || "Không xác định",
            date: order.created_at
              ? new Date(order.created_at).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0],
            totalAmount: order.total_amount || 0,
            isReviewed,
            isCombo: order.isCombo || false, // Giả định API trả về isCombo
            items,
            reviews: orderReviews,
          };
        });

      setOrders(fetchedOrders);
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.message || "Không thể tải dữ liệu",
        confirmButtonText: "OK",
      });
      setOrders([]);
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (refresh) {
      setIsLoading(true);
      fetchData();
      router.replace("/feedback");
    }
  }, [refresh]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const pendingOrders = orders.filter((order) => !order.isReviewed);
  const reviewedOrders = orders.filter((order) => order.isReviewed);

  if (isLoading) {
    return <div className="text-center py-8">Đang tải danh sách phản hồi...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-6 text-pink-500">Phản Hồi Đơn Hàng</h1>

        <div className="mb-6">
          <div className="flex border-b">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "pending"
                  ? "border-b-2 border-pink-500 text-pink-500"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("pending")}
            >
              Đánh giá ({pendingOrders.length})
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "reviewed"
                  ? "border-b-2 border-pink-500 text-pink-500"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("reviewed")}
            >
              Đã đánh giá ({reviews.length})
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 text-black">
          {activeTab === "pending" ? (
            pendingOrders.length > 0 ? (
              <div className="space-y-6">
                {pendingOrders.map((order) => (
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
                        <Link
                          href={`/feedback/${order.id}${order.isCombo ? "?isCombo=true" : ""}`}
                          className="inline-flex items-center px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-md text-sm transition-all duration-300"
                        >
                          <PenSquare className="w-4 h-4 mr-2" /> Đánh Giá
                        </Link>
                      </div>
                    </div>

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
                      </div>
                    ) : (
                      <p className="text-gray-500">Không có sản phẩm trong đơn hàng.</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Bạn chưa có đơn hàng nào cần đánh giá.</p>
            )
          ) : (
            <div>
              {reviews.length > 0 ? (
                <div className="space-y-8 mt-8">
                  <h2 className="text-lg font-semibold text-gray-800">Chi tiết đánh giá</h2>
                  {reviews
                    .filter((review) => review.status === "active")
                    .map((review) => {
                      const sku = review.sku || {};
                      const variantValues = sku.variant_values || [];
                      const reviewImages = sku.image_url ? [sku.image_url] : [];

                      return (
                        <div
                          key={review.id}
                          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <div className="font-medium text-black hover:text-pink-600 transition-colors duration-300">
                                Người dùng #{review.user_id}
                              </div>
                              <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 transition-colors duration-200 ${
                                      star <= review.rating ? "text-yellow-400" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(review.created_at).toLocaleDateString("vi-VN")}
                            </div>
                          </div>
                          <p className="text-black mb-3">{review.comment || "Không có nhận xét"}</p>
                          <div className="text-sm text-gray-500 space-y-1 mb-4">
                            <p><span className="font-medium">Tên sản phẩm:</span> {sku.product?.name || "Không xác định"}</p>
                          </div>
                          {reviewImages.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {reviewImages.map((image, index) => (
                                <Link
                                  href={`/product/${review.sku_id}`}
                                  key={`${review.id}-${index}`}
                                  className="block"
                                >
                                  <div className="relative aspect-square rounded-md overflow-hidden border border-gray-200 transform transition-all duration-300 hover:scale-105 hover:shadow-md">
                                    <Image
                                      src={image}
                                      alt={`Review image ${index + 1}`}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                </Link>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm">Không có ảnh minh họa.</p>
                          )}
                          <div className="text-xs text-gray-500 mt-4 space-y-1">
                            <p><span className="font-medium"></span> {new Date(review.updated_at).toLocaleString("vi-VN")}</p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <p className="text-gray-500">Bạn chưa có đánh giá nào.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FeedbackPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FeedbackContent />
    </Suspense>
  );
};

export default FeedbackPage;