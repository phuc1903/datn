"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Star, ChevronLeft } from "lucide-react";
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
  items: OrderItem[];
}

const ReviewPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [ratings, setRatings] = useState<{ [key: string]: number }>({}); // Rating for each item
  const [comments, setComments] = useState<{ [key: string]: string }>({}); // Comment for each item
  const [userId, setUserId] = useState<string | null>(null);

  const statusMap: { [key: string]: string } = {
    success: "Giao hàng thành công",
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const userToken = Cookies.get("accessToken");
      const userEmail = Cookies.get("userEmail");
      const storedUserId = Cookies.get("userId");

      if (!userToken || !userEmail) {
        router.push("/login");
        setIsLoading(false);
        return;
      }

      try {
        if (!storedUserId) {
          const userRes = await fetch(`${API_BASE_URL}/users`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
          });
          if (!userRes.ok) {
            const errorText = await userRes.text();
            throw new Error(`Không thể lấy thông tin người dùng: ${userRes.status} - ${errorText}`);
          }
          const userData = await userRes.json();
          const foundUser = userData.data.find((u: any) => u.email === userEmail);
          if (!foundUser) throw new Error("Không tìm thấy người dùng");
          setUserId(foundUser.id.toString());
        } else {
          setUserId(storedUserId);
        }

        const url = `${API_BASE_URL}/orders/${orderId}`;
        const response = await fetch(url, {
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
        if (result.status !== "success") {
          throw new Error(result.message || "Không thể lấy chi tiết đơn hàng");
        }

        const orderData = result.data;
        if (!orderData || orderData.status?.toLowerCase() !== "success") {
          throw new Error("Đơn hàng không hợp lệ hoặc chưa giao hàng thành công");
        }

        const fetchedOrder: Order = {
          id: orderData.id?.toString() || "",
          orderNumber: orderData.order_number || `OD-${orderData.id}`,
          status: statusMap[orderData.status?.toLowerCase()] || "Không xác định",
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
      } catch (error: any) {
        console.error("Fetch order details error:", error);
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

    if (orderId && typeof orderId === "string" && orderId.trim() !== "") {
      fetchOrderDetails();
    } else {
      setIsLoading(false);
      setOrder(null);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không tìm thấy ID đơn hàng. Quay lại trang phản hồi.",
        confirmButtonText: "OK",
      }).then(() => {
        router.push("/feedback");
      });
    }
  }, [orderId, router]);

  const handleRating = (itemId: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [itemId]: rating }));
  };

  const handleCommentChange = (itemId: string, comment: string) => {
    setComments((prev) => ({ ...prev, [itemId]: comment }));
  };

  const handleSubmit = async () => {
    if (!order || !userId) return;

    const reviews = order.items.map((item) => ({
      sku_id: item.sku_id,
      order_id: order.id,
      rating: ratings[item.id] || 0,
      comment: comments[item.id] || "",
    }));

    const invalidItems = reviews.filter((review) => !review.sku_id || review.rating === 0);
    if (invalidItems.length > 0) {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        text: "Vui lòng kiểm tra thông tin sản phẩm và đánh giá sao!",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const userToken = Cookies.get("accessToken");
      if (!userToken) {
        throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      }

      console.log("Submitting reviews:", reviews);
      console.log("User token:", userToken);

      for (const review of reviews) {
        const response = await fetch(`${API_BASE_URL}/product_feedbacks/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify(review),
        });

        if (!response.ok) {
          const contentType = response.headers.get("content-type");
          let errorMessage = "Không thể gửi đánh giá";

          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            console.error("Error response:", response.status, errorData);
            errorMessage = errorData.message || `Không thể gửi đánh giá: ${response.status}`;
          } else {
            const text = await response.text();
            console.error("Non-JSON response:", text);
            errorMessage = `Lỗi server: ${response.status} - Vui lòng kiểm tra API endpoint`;
          }

          throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log("Success response:", data);
      }

      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Đánh giá của bạn đã được gửi!",
        confirmButtonText: "OK",
      }).then(() => {
        router.push("/feedback?refresh=true");
      });
    } catch (error: any) {
      console.error("Submission error:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.message || "Không thể gửi đánh giá",
        confirmButtonText: "OK",
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Đang tải...</div>;
  }

  if (!order) {
    return <div className="text-center py-8">Không tìm thấy đơn hàng.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link
          href="/feedback"
          className="flex items-center text-pink-600 hover:text-pink-800 mb-6"
        >
          <ChevronLeft className="w-5 h-5" /> Quay lại trang phản hồi
        </Link>

        <h1 className="text-2xl font-semibold mb-6 text-pink-500">
          Đánh Giá Đơn Hàng #{order.orderNumber}
        </h1>

        <div className="bg-white rounded-lg shadow p-6 text-black">
          {order.items.length > 0 ? (
            <div className="space-y-6">
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
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRating(item.id, star)}
                          className={`focus:outline-none ${
                            (ratings[item.id] || 0) >= star
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          <Star className="w-6 h-6" fill="currentColor" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nhận xét
                    </label>
                    <textarea
                      value={comments[item.id] || ""}
                      onChange={(e) => handleCommentChange(item.id, e.target.value)}
                      placeholder="Nhập nhận xét của bạn..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      rows={4}
                    />
                  </div>
                </div>
              ))}
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleSubmit}
                  className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700"
                >
                  Gửi đánh giá
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Không có sản phẩm để đánh giá.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;