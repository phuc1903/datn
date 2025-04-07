"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Star, CheckCircle } from "lucide-react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
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
  items: OrderItem[];
}

interface ReviewForm {
  [sku_id: string]: {
    rating: number;
    comment: string;
  };
}

const SubmitFeedbackPage = () => {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string; // Matches the dynamic route [id]
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reviews, setReviews] = useState<ReviewForm>({});

  const statusMap: { [key: string]: string } = {
    success: "Giao hàng thành công",
  };

  // Sửa lỗi bằng cách định nghĩa kiểu rõ ràng với index signature
  const statusIcons: { [key: string]: React.JSX.Element } = {
    "Giao hàng thành công": <CheckCircle className="w-5 h-5 text-green-500" />,
  };

  const fetchWithRetry = async (url: string, options: RequestInit, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        return response;
      } catch (error) {
        console.error(`Fetch error (${i + 1}/${retries}) for ${url}:`, error); // Log the error for debugging
        if (i === retries - 1) throw error;
        console.warn(`Retrying fetch (${i + 1}/${retries}) for ${url}...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    throw new Error("Max retries reached");
  };

  const fetchOrder = async () => {
    try {
      const userToken = Cookies.get("accessToken");
      const userEmail = Cookies.get("userEmail");

      if (!userToken || !userEmail) {
        router.push("/login");
        setIsLoading(false);
        return;
      }

      const ordersUrl = `${API_BASE_URL}/users/orders/${orderId}`;
      const ordersResponse = await fetchWithRetry(ordersUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (!ordersResponse.ok) {
        const errorText = await ordersResponse.text();
        throw new Error(`Không thể lấy thông tin đơn hàng: ${ordersResponse.status} - ${errorText}`);
      }

      const orderResult = await ordersResponse.json();
      const orderData = orderResult.data;

      const fetchedOrder: Order = {
        id: orderData.id?.toString() || "",
        orderNumber: orderData.order_number || `OD-${orderData.id}`,
        status: statusMap[orderData.status?.toLowerCase()] || "Không xác định",
        date: orderData.created_at
          ? new Date(orderData.created_at).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        totalAmount: orderData.totalAmount || 0,
        items: (orderData.items || []).map((item: any) => ({
          id: item.id?.toString() || "",
          quantity: item.quantity || 0,
          price: item.price || 0,
          sku_id: item.sku?.id?.toString() || "",
          product: {
            name: item.sku?.product?.name || "Sản phẩm không xác định",
          },
        })),
      };

      setOrder(fetchedOrder);

      // Initialize reviews state for each item
      const initialReviews: ReviewForm = {};
      fetchedOrder.items.forEach((item) => {
        initialReviews[item.sku_id] = { rating: 0, comment: "" };
      });
      setReviews(initialReviews);
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.message || "Không thể tải dữ liệu đơn hàng",
        confirmButtonText: "OK",
      });
      router.push("/feedback");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const handleRatingChange = (sku_id: string, rating: number) => {
    setReviews((prev) => ({
      ...prev,
      [sku_id]: { ...prev[sku_id], rating },
    }));
  };

  const handleCommentChange = (sku_id: string, comment: string) => {
    setReviews((prev) => ({
      ...prev,
      [sku_id]: { ...prev[sku_id], comment },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userToken = Cookies.get("accessToken");
      const userEmail = Cookies.get("userEmail");
      const userId = Cookies.get("userId"); // Retrieve userId from cookies

      if (!userToken || !userEmail || !userId) {
        router.push("/login");
        return;
      }

      console.log("Submitting reviews with token:", userToken); // Debug log
      console.log("User ID:", userId); // Debug log

      const reviewPromises = Object.keys(reviews).map(async (sku_id) => {
        const review = reviews[sku_id];
        if (review.rating === 0) {
          return Promise.resolve(); // Skip if no rating is provided
        }

        const response = await fetchWithRetry(`${API_BASE_URL}/product_feedbacks/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            sku_id,
            user_id: userId, // Include user_id in the request body
            order_id: orderId,
            rating: review.rating,
            comment: review.comment || "",
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Không thể gửi đánh giá: ${response.status} - ${errorText}`);
        }
      });

      await Promise.all(reviewPromises);

      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Đánh giá của bạn đã được gửi thành công!",
        confirmButtonText: "OK",
      }).then(() => {
        router.push("/feedback?refresh=true");
      });
    } catch (error: any) {
      console.error("Submit error:", error); // Debug log
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.message || "Không thể gửi đánh giá",
        confirmButtonText: "OK",
      });
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  if (isLoading) {
    return <div className="text-center py-8">Đang tải thông tin đơn hàng...</div>;
  }

  if (!order) {
    return <div className="text-center py-8">Không tìm thấy đơn hàng.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-6 text-pink-500">Đánh Giá Đơn Hàng</h1>

        <div className="bg-white rounded-lg shadow p-6 text-black">
          <div className="mb-6">
            <div className="flex items-center justify-between">
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
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {order.items.map((item) => (
              <div key={item.id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-center gap-4 mb-4">
                  <div>
                    <span className="font-medium block">{item.product.name}</span>
                    <span className="text-sm text-gray-500">Số lượng: {item.quantity}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đánh giá sao
                  </label>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-6 h-6 cursor-pointer transition-colors duration-200 ${
                          star <= reviews[item.sku_id].rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        onClick={() => handleRatingChange(item.sku_id, star)}
                      />
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor={`comment-${item.sku_id}`}
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nhận xét
                  </label>
                  <textarea
                    id={`comment-${item.sku_id}`}
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    rows={4}
                    value={reviews[item.sku_id].comment}
                    onChange={(e) => handleCommentChange(item.sku_id, e.target.value)}
                    placeholder="Viết nhận xét của bạn về sản phẩm..."
                  />
                </div>
              </div>
            ))}

            <div className="text-right">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-md text-sm transition-all duration-300"
              >
                Gửi Đánh Giá
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitFeedbackPage;