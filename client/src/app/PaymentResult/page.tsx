"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { API_BASE_URL } from "@/config/config";

interface PaymentResult {
  orderId: string;
  resultCode: string;
  message: string;
  amount: string;
  orderInfo: string;
  orderType: string;
  transId: string;
  payType: string;
  responseTime: string;
  extraData: string;
  signature: string;
}

interface Sku {
  id: string;
  price: number;
  image_url: string;
  product: {
    name: string;
    id: string;
  };
  variant_values: { value: string }[];
}

interface CartItem {
  sku: Sku;
  sku_id: string;
  quantity: number;
}

const PaymentResultContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Lấy dữ liệu giỏ hàng khi trang được tải
  useEffect(() => {
    const fetchCartData = async () => {
      const userToken = Cookies.get("accessToken");
      const email = Cookies.get("userEmail");

      if (!userToken || !email) {
        console.warn("No token or email found, redirecting to login.");
        Cookies.remove("accessToken");
        Cookies.remove("userEmail");
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/users/carts`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Lỗi lấy giỏ hàng: ${response.status} - ${response.statusText}`);
        }

        const result = await response.json();
        if (result.data?.email === email) {
          const items: CartItem[] = result.data.carts || [];
          setCartItems(items);
        } else {
          setCartItems([]);
        }
      } catch (error: unknown) {
        console.error("Lỗi khi lấy giỏ hàng:", error);
        setCartItems([]);
      }
    };

    fetchCartData();
  }, [router]);

  // Xử lý kết quả thanh toán
  useEffect(() => {
    const fetchPaymentResult = async () => {
      const result: PaymentResult = {
        orderId: searchParams.get("orderId") || "",
        resultCode: searchParams.get("resultCode") || "",
        message: searchParams.get("message") || "",
        amount: searchParams.get("amount") || "",
        orderInfo: searchParams.get("orderInfo") || "",
        orderType: searchParams.get("orderType") || "",
        transId: searchParams.get("transId") || "",
        payType: searchParams.get("payType") || "",
        responseTime: searchParams.get("responseTime") || "",
        extraData: searchParams.get("extraData") || "",
        signature: searchParams.get("signature") || "",
      };

      setPaymentResult(result);
      setIsLoading(false);

      // Kiểm tra trạng thái thanh toán
      if (result.resultCode === "0") {
        // Thanh toán thành công, xóa giỏ hàng
        const userToken = Cookies.get("accessToken");
        if (userToken && cartItems.length > 0) {
          try {
            for (const item of cartItems) {
              await fetch(`${API_BASE_URL}/carts/${item.sku.product.id}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${userToken}`,
                },
              });
            }
            console.log("Giỏ hàng đã được xóa thành công.");
          } catch (error) {
            console.error("Lỗi khi xóa giỏ hàng:", error);
          }
        }

        Swal.fire({
          icon: "success",
          title: "Thanh toán thành công!",
          text: `Đơn hàng ${result.orderId} đã được thanh toán thành công. Số tiền: ${Number(
            result.amount
          ).toLocaleString()} VND.`,
          confirmButtonText: "Tiếp tục mua sắm",
        }).then(() => {
          router.push("/shop");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Thanh toán thất bại",
          text: `Thanh toán không thành công. Mã lỗi: ${result.resultCode}. Thông báo: ${result.message}`,
          confirmButtonText: "Thử lại",
        }).then(() => {
          router.push("/cart");
        });
      }
    };

    if (cartItems !== null) {
      fetchPaymentResult();
    }
  }, [searchParams, router, cartItems]);

  // Xử lý khi nhấn nút "Tiếp tục mua sắm"
  const handleContinueShopping = async () => {
    // Nếu thanh toán thành công, giỏ hàng đã được xóa ở bước trên
    router.push("/shop");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Đang xử lý kết quả thanh toán...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow p-6 max-w-lg w-full">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Kết quả thanh toán</h2>
        {paymentResult && (
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Mã đơn hàng:</span>
              <span className="text-gray-900">{paymentResult.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Trạng thái:</span>
              <span
                className={
                  paymentResult.resultCode === "0" ? "text-green-600" : "text-red-600"
                }
              >
                {paymentResult.resultCode === "0" ? "Thành công" : "Thất bại"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Số tiền:</span>
              <span className="text-gray-900">
                {Number(paymentResult.amount).toLocaleString()} VND
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Thông tin đơn hàng:</span>
              <span className="text-gray-900">{paymentResult.orderInfo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Mã giao dịch:</span>
              <span className="text-gray-900">{paymentResult.transId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Thời gian:</span>
              <span className="text-gray-900">{paymentResult.responseTime}</span>
            </div>
            <button
              onClick={handleContinueShopping}
              className="w-full mt-6 bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default function PaymentResult() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentResultContent />
    </Suspense>
  );
}