"use client";

import { useEffect, useState } from "react";
import { Gift } from "lucide-react";
import { API_BASE_URL } from "@/config";
import { Voucher } from "@/types/profile";
import Cookies from "js-cookie";

export default function Vouchers() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const token = Cookies.get("accessToken");
        const response = await fetch(`${API_BASE_URL}/api/v1/users/vouchers`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Không thể tải danh sách voucher");
        }

        const data = await response.json();
        setVouchers(data.data.vouchers);
      } catch (err) {
        console.error("Error fetching vouchers:", err);
        setError(err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải danh sách voucher");
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (vouchers.length === 0) {
    return (
      <div className="text-center p-8">
        <Gift className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có voucher nào</h3>
        <p className="text-gray-500">Bạn chưa có voucher nào trong tài khoản</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Voucher của tôi</h2>
      <div className="grid gap-4">
        {vouchers.map((voucher) => (
          <div
            key={voucher.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{voucher.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{voucher.description}</p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">
                    Giá trị: {voucher.type === "percent" ? `${voucher.discount_value}%` : `${voucher.discount_value.toLocaleString()}đ`}
                  </p>
                  <p className="text-sm text-gray-600">
                    Đơn hàng tối thiểu: {voucher.min_order_value.toLocaleString()}đ
                  </p>
                  {voucher.type === "percent" && (
                    <p className="text-sm text-gray-600">
                      Giảm tối đa: {voucher.max_discount_value.toLocaleString()}đ
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    Còn lại: {voucher.quantity} lượt
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  voucher.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {voucher.status === "active" ? "Đang hoạt động" : "Đã hết hạn"}
                </span>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(voucher.started_date).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 