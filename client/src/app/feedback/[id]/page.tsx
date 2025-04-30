"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Star, Loader2, ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import Link from "next/link";
import { API_BASE_URL } from "@/config/config";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  sku_id?: string;
  combo_id?: string;
  product?: {
    name: string;
  };
  image_url?: string;
  sku?: {
    variant_details?: { [key: string]: string };
  };
  combo?: {
    name: string;
    skus: { sku_id: string; product_name: string; image_url?: string; variant_details?: { [key: string]: string } }[];
  };
  feedback?: {
    id: string;
    sku_id?: string;
    combo_id?: string;
    user_id: string;
    order_id: string;
    rating: string;
    comment: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
  combo_feedback?: {
    id: string;
    combo_id?: string;
    user_id: string;
    order_id: string;
    rating: string;
    comment: string;
    created_at: string;
    updated_at: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  date: string;
  totalAmount: number;
  items: OrderItem[];
  isReviewed: boolean;
}

interface FeedbackForm {
  sku_id?: string;
  combo_id?: string;
  rating: number;
  comment: string;
}

const ReviewPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [feedbacks, setFeedbacks] = useState<FeedbackForm[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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

  const checkOrderReviewedStatus = async (orderId: string, userToken: string): Promise<boolean> => {
    try {
      // Lấy user_id từ API /users
      const userResponse = await fetchWithRetry(`${API_BASE_URL}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });

      const userData = await userResponse.json();
      if (!userResponse.ok || userData.status !== "success") {
        throw new Error(userData.message || "Không thể lấy thông tin người dùng");
      }

      const userId = userData.data.id?.toString();
      if (!userId) {
        throw new Error("Không tìm thấy ID người dùng trong dữ liệu");
      }

      // Kiểm tra feedback qua endpoint /product_feedbacks
      const feedbackResponse = await fetchWithRetry(`${API_BASE_URL}/product_feedbacks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });

      const feedbackData = await feedbackResponse.json();
      if (feedbackResponse.ok && feedbackData.status === "success") {
        const hasFeedback = feedbackData.data.some(
          (feedback: any) =>
            feedback.order_id.toString() === orderId &&
            feedback.user_id.toString() === userId
        );
        if (hasFeedback) {
          return true; // Đơn hàng đã được đánh giá bởi người dùng
        }
      } else if (feedbackData.status === "error" && feedbackData.code !== 404) {
        throw new Error(feedbackData.message || "Không thể kiểm tra trạng thái đánh giá");
      }

      // Kiểm tra thêm qua endpoint /product_feedbacks/getAllOrderItem
      const orderItemResponse = await fetchWithRetry(`${API_BASE_URL}/product_feedbacks/getAllOrderItem`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (!orderItemResponse.ok) {
        const errorText = await orderItemResponse.text();
        console.error("Lỗi khi kiểm tra trạng thái đánh giá:", errorText);
        throw new Error(`Không thể kiểm tra trạng thái đánh giá: ${orderItemResponse.status}`);
      }

      const orderItemData = await orderItemResponse.json();
      if (!orderItemResponse.ok || orderItemData.status !== "success") {
        throw new Error(orderItemData.message || "Không thể kiểm tra trạng thái đơn hàng");
      }

      const orderItems = orderItemData.data;
      return orderItems.some(
        (item: any) =>
          item.order_id.toString() === orderId &&
          (item.feedback || item.combo_feedback)
      );
    } catch (error: any) {
      console.error("Lỗi khi kiểm tra trạng thái đánh giá:", error.message);
      throw error; // Ném lỗi để xử lý trong fetchOrder
    }
  };

  const fetchOrder = async () => {
    console.log(`Bắt đầu lấy dữ liệu đơn hàng ID: ${id}`);
    try {
      if (!navigator.onLine) {
        throw new Error("Không có kết nối mạng. Vui lòng kiểm tra lại!");
      }

      const userToken = Cookies.get("accessToken");
      const userData = Cookies.get("userData");

      console.log("Token:", userToken ? "Có token" : "Không có token");
      console.log("userData:", userData ? "Có userData" : "Không có userData");

      if (!userToken || !userData) {
        console.log("Không tìm thấy token hoặc userData, chuyển hướng về trang login");
        router.push("/login");
        return;
      }

      try {
        const parsedUserData = JSON.parse(userData);
        console.log("parsedUserData:", parsedUserData ? "Parse thành công" : "Parse thất bại");
        
        // Tiếp tục xử lý với parsedUserData
        const isReviewed = await checkOrderReviewedStatus(id as string, userToken);
        if (isReviewed) {
          throw new Error("Đơn hàng đã được đánh giá!");
        }
      } catch (error) {
        console.error("Lỗi khi parse userData:", error);
        Cookies.remove("accessToken");
        Cookies.remove("userData");
        router.push("/login");
        return;
      }

      // Lấy thông tin đơn hàng
      const ordersUrl = `${API_BASE_URL}/users/orders`;
      console.log("Đang fetch orders từ URL:", ordersUrl);
      const ordersResponse = await fetchWithRetry(ordersUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (!ordersResponse.ok) {
        if (ordersResponse.status === 401) {
          console.log("Token không hợp lệ (401), chuyển hướng về trang login");
          Cookies.remove("accessToken");
          Cookies.remove("userData");
          router.push("/login");
          return;
        }
        const errorText = await ordersResponse.text();
        console.error("Lỗi khi lấy danh sách đơn hàng:", errorText);
        throw new Error(`Không thể lấy danh sách đơn hàng: ${ordersResponse.status}`);
      }

      const ordersData = await ordersResponse.json();
      if (ordersData.status !== "success") {
        throw new Error(ordersData.message || "Không thể lấy danh sách đơn hàng");
      }

      const orderItems = ordersData.data;
      const targetOrder = orderItems.find((order: any) => order.id.toString() === id);

      if (!targetOrder) {
        throw new Error(`Không tìm thấy đơn hàng với ID ${id}`);
      }

      if (targetOrder.status?.toLowerCase() !== "success") {
        throw new Error("Chỉ các đơn hàng giao thành công mới có thể được đánh giá");
      }

      const items = (targetOrder.items || [])
        .filter((item: any) => item.sku || item.combo)
        .map((item: any) => ({
          id: item.id?.toString() || "",
          quantity: item.quantity || 0,
          price: item.price || 0,
          sku_id: item.sku_id ? item.sku_id.toString() : undefined,
          combo_id: item.combo_id ? item.combo_id.toString() : undefined,
          product: item.sku
            ? {
                name: item.sku?.product?.name || "Sản phẩm không xác định",
              }
            : undefined,
          image_url: item.sku?.image_url || item.combo?.skus?.[0]?.image_url || "",
          sku: item.sku
            ? {
                variant_details: item.sku?.variant_details || {},
              }
            : undefined,
          combo: item.combo
            ? {
                name: item.combo.name || "Combo không xác định",
                skus: item.combo.skus || [],
              }
            : undefined,
          feedback: item.feedback || null,
          combo_feedback: item.combo_feedback || null,
        }));

      const feedbacksData: FeedbackForm[] = items.map((item: any) => ({
        sku_id: item.sku_id,
        combo_id: item.combo_id,
        rating: 0,
        comment: "",
      }));

      const mappedOrder: Order = {
        id: targetOrder.id.toString(),
        orderNumber: targetOrder.order_number || `OD-${targetOrder.id}`,
        status: "Giao hàng thành công",
        date: targetOrder.created_at
          ? new Date(targetOrder.created_at).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        totalAmount: targetOrder.total_amount || 0,
        isReviewed: false,
        items,
      };

      setOrder(mappedOrder);
      setFeedbacks(feedbacksData);
    } catch (error: any) {
      console.error("Lỗi khi lấy dữ liệu đơn hàng:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.message || "Không thể tải dữ liệu đơn hàng",
        confirmButtonText: "Quay lại",
      }).then(() => {
        router.push("/feedback?switchTab=reviewed");
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const handleRatingChange = (identifier: string, rating: number, isCombo: boolean) => {
    setFeedbacks((prev) =>
      prev.map((feedback) =>
        (isCombo && feedback.combo_id === identifier) ||
        (!isCombo && feedback.sku_id === identifier)
          ? { ...feedback, rating }
          : feedback
      )
    );
  };

  const handleCommentChange = (identifier: string, comment: string, isCombo: boolean) => {
    setFeedbacks((prev) =>
      prev.map((feedback) =>
        (isCombo && feedback.combo_id === identifier) ||
        (!isCombo && feedback.sku_id === identifier)
          ? { ...feedback, comment }
          : feedback
      )
    );
  };

  const handleSubmit = async () => {
    if (!order) return;

    try {
      const userToken = Cookies.get("accessToken");
      const userData = Cookies.get("userData");

      console.log("Submit - Token:", userToken ? "Có token" : "Không có token");
      console.log("Submit - userData:", userData ? "Có userData" : "Không có userData");

      if (!userToken || !userData) {
        console.log("Không tìm thấy token hoặc userData khi submit, chuyển hướng về trang login");
        router.push("/login");
        return;
      }

      let parsedUserData;
      try {
        parsedUserData = JSON.parse(userData);
      } catch (error) {
        console.error("Lỗi khi parse userData khi submit:", error);
        Cookies.remove("accessToken");
        Cookies.remove("userData");
        router.push("/login");
        return;
      }

      const hasInvalidFeedback = feedbacks.some((feedback) => feedback.rating === 0);
      if (hasInvalidFeedback) {
        Swal.fire({
          icon: "warning",
          title: "Chưa hoàn thành",
          text: "Vui lòng đánh giá số sao cho tất cả sản phẩm hoặc combo!",
          confirmButtonText: "OK",
        });
        return;
      }

      setIsSubmitting(true);

      const promises = feedbacks.map(async (feedback) => {
        const formData = new FormData();
        formData.append("order_id", order.id);
        formData.append("rating", feedback.rating.toString());
        formData.append("comment", feedback.comment);

        if (feedback.combo_id) {
          formData.append("combo_id", feedback.combo_id);
        } else if (feedback.sku_id) {
          formData.append("sku_id", feedback.sku_id);
        }

        const endpoint = feedback.combo_id
          ? `${API_BASE_URL}/combo_feedback/create`
          : `${API_BASE_URL}/product_feedbacks/create`;

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          body: formData,
        });

        const responseData = await response.json();
        console.log(`Feedback response for ${feedback.combo_id || feedback.sku_id}:`, responseData);

        if (!response.ok || responseData.status !== "success") {
          if (responseData.message === "This Product be Fedback") {
            throw new Error("Sản phẩm hoặc combo này đã được đánh giá!");
          } else if (responseData.message === "The Order not successfully") {
            throw new Error("Đơn hàng chưa giao thành công!");
          } else if (responseData.message === "User dont has this order") {
            throw new Error("Bạn không sở hữu đơn hàng này!");
          } else if (responseData.message === "The Order not found") {
            throw new Error("Không tìm thấy đơn hàng!");
          } else if (responseData.message === "Sku is not found") {
            throw new Error("Sản phẩm không tồn tại!");
          } else {
            throw new Error(
              responseData.message || `Không thể gửi đánh giá cho ${feedback.combo_id || feedback.sku_id}`
            );
          }
        }

        return responseData;
      });

      await Promise.all(promises);

      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Đánh giá của bạn đã được gửi!",
        confirmButtonText: "OK",
      }).then(() => {
        router.push("/feedback?refresh=true&switchTab=reviewed");
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.message || "Không thể gửi đánh giá",
        confirmButtonText: "OK",
      }).then(() => {
        if (
          error.message === "Sản phẩm hoặc combo này đã được đánh giá!" ||
          error.message === "Đơn hàng chưa giao thành công!" ||
          error.message === "Bạn không sở hữu đơn hàng này!" ||
          error.message === "Không tìm thấy đơn hàng!"
        ) {
          router.push("/feedback?switchTab=reviewed");
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  if (isLoading) {
    return <div className="text-center py-8">Đang tải dữ liệu đơn hàng...</div>;
  }

  if (!order) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Không tìm thấy đơn hàng để đánh giá.</p>
        <Link href="/feedback" className="text-pink-500 hover:underline">
          Quay lại danh sách đơn hàng
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center mb-6">
          <Link href="/feedback" className="mr-4 text-pink-500 hover:text-pink-700">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-semibold text-pink-500">
            Đánh Giá Đơn Hàng #{order.orderNumber}
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6 text-black">
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium block">Trạng thái: {order.status}</span>
                <span className="text-sm text-gray-500">Ngày đặt: {order.date}</span>
              </div>
              <span className="font-medium">Tổng tiền: {formatPrice(order.totalAmount)}</span>
            </div>
          </div>

          <div className="space-y-6">
            {order.items.map((item, index) => {
              const feedback = feedbacks[index];
              const isCombo = !!item.combo_id;
              const identifier = isCombo ? item.combo_id! : item.sku_id!;

              return (
                <div key={item.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-start gap-4 mb-4">
                    {isCombo ? (
                      <div className="flex gap-2">
                        {item.combo?.skus?.slice(0, 2).map((sku) => (
                          <img
                            key={sku.sku_id}
                            src={sku.image_url || "/fallback-image.png"}
                            alt={sku.product_name}
                            className="w-16 h-16 object-cover rounded-md"
                            onError={(e) => {
                              e.currentTarget.src = "/fallback-image.png";
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <img
                        src={item.image_url || "/fallback-image.png"}
                        alt={item.product?.name}
                        className="w-16 h-16 object-cover rounded-md"
                        onError={(e) => {
                          e.currentTarget.src = "/fallback-image.png";
                        }}
                      />
                    )}
                    <div>
                      <span className="font-medium block">
                        {isCombo ? item.combo?.name : item.product?.name}
                      </span>
                      <span className="text-sm text-gray-500">Số lượng: {item.quantity}</span>
                      <span className="text-sm text-gray-500 block">
                        Giá: {formatPrice(item.price)}
                      </span>
                      {isCombo ? (
                        <div className="text-sm text-gray-500">
                          <span className="block">Sản phẩm trong combo:</span>
                          <ul className="list-disc ml-4">
                            {item.combo?.skus?.map((sku) => (
                              <li key={sku.sku_id}>{sku.product_name}</li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        item.sku?.variant_details &&
                        Object.keys(item.sku.variant_details).length > 0 && (
                          <div className="text-sm text-gray-500">
                            {Object.entries(item.sku.variant_details).map(([key, value]) => (
                              <span key={key} className="block">
                                {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                              </span>
                            ))}
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Đánh giá của bạn:</label>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-6 h-6 cursor-pointer transition-colors duration-200 ${
                            star <= feedback.rating ? "text-yellow-400" : "text-gray-300"
                          }`}
                          onClick={() => handleRatingChange(identifier, star, isCombo)}
                        />
                      ))}
                    </div>
                    {feedback.rating === 0 && (
                      <p className="text-red-500 text-sm mt-1">Vui lòng chọn số sao</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Nhận xét của bạn:</label>
                    <textarea
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      rows={3}
                      value={feedback.comment}
                      onChange={(e) => handleCommentChange(identifier, e.target.value, isCombo)}
                      placeholder="Viết nhận xét của bạn..."
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => router.push("/feedback")}
              className="px-4 py-2 bg-gray-500 text-white rounded-md"
            >
              Quay lại
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`inline-flex items-center px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-md text-sm transition-all duration-300 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                "Gửi Đánh Giá"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;