"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config/config";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

interface Voucher {
  id: number;
  title: string;
  description: string;
  quantity: number;
  type: "percent" | "price";
  discount_value: number;
  max_discount_value: number;
  min_order_value: number;
  status: string;
  started_date: string;
  ended_date: string | null;
  created_at: string;
  updated_at: string;
}

interface UserVoucher extends Voucher {
  pivot: {
    user_id: number;
    voucher_id: number;
  };
}

interface VoucherResponse {
  status: string;
  message: string;
  data: {
    current_page: number;
    data: Voucher[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

interface UserVouchersResponse {
  status: string;
  message: string;
  data: {
    id: number;
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    email_verified_at: string | null;
    status: string;
    sex: string;
    google_id: string | null;
    created_at: string;
    updated_at: string;
    vouchers: UserVoucher[];
  };
}

export default function VoucherPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimedVouchers, setClaimedVouchers] = useState<number[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchVouchers();
    fetchUserVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/vouchers`);
      const data: VoucherResponse = await response.json();
      
      if (data.status === "success") {
        setVouchers(data.data.data);
      }
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      Swal.fire({
        title: "Lỗi!",
        text: "Không thể tải danh sách voucher",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#db2777",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserVouchers = async () => {
    const token = Cookies.get("accessToken");
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/users/vouchers`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data: UserVouchersResponse = await response.json();
      
      if (data.status === "success") {
        const userVoucherIds = data.data.vouchers.map(v => v.id);
        setClaimedVouchers(userVoucherIds);
      }
    } catch (error) {
      console.error("Error fetching user vouchers:", error);
    }
  };

  const handleClaimVoucher = async (voucherId: number) => {
    const token = Cookies.get("accessToken");
    
    if (!token) {
      Swal.fire({
        title: "Thông báo",
        text: "Vui lòng đăng nhập để thu thập voucher",
        icon: "info",
        confirmButtonText: "Đăng nhập",
        confirmButtonColor: "#db2777",
        showCancelButton: true,
        cancelButtonText: "Hủy",
        cancelButtonColor: "#6b7280",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/login");
        }
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/vouchers/${voucherId}/claim`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.status === "success") {
        setClaimedVouchers((prev) => [...prev, voucherId]);
        Swal.fire({
          title: "Thành công!",
          text: "Thu thập voucher thành công!",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#db2777",
        });
      } else {
        let errorMessage = "Thu thập voucher thất bại";
        if (data.message.includes("expired")) {
          errorMessage = "Voucher đã hết hạn";
        } else if (data.message.includes("out of stock")) {
          errorMessage = "Voucher đã hết";
        }
        
        Swal.fire({
          title: "Thông báo",
          text: errorMessage,
          icon: "info",
          confirmButtonText: "OK",
          confirmButtonColor: "#db2777",
        });
      }
    } catch (error) {
      console.error("Error claiming voucher:", error);
      Swal.fire({
        title: "Lỗi!",
        text: "Có lỗi xảy ra khi thu thập voucher",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#db2777",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Voucher Khuyến Mãi
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vouchers.map((voucher) => (
            <div
              key={voucher.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {voucher.title}
                </h3>
                <p className="text-gray-600 mb-4">{voucher.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Giá trị:</span>
                    <span className="font-medium text-pink-600">
                      {voucher.type === "percent"
                        ? `${voucher.discount_value}%`
                        : `${voucher.discount_value.toLocaleString()}đ`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tối đa:</span>
                    <span className="font-medium">
                      {voucher.max_discount_value 
                        ? `${voucher.max_discount_value.toLocaleString()}đ`
                        : "Không giới hạn"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Đơn tối thiểu:</span>
                    <span className="font-medium">
                      {voucher.min_order_value.toLocaleString()}đ
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Số lượng:</span>
                    <span className="font-medium">{voucher.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Hạn sử dụng:</span>
                    <span className="font-medium">
                      {voucher.ended_date
                        ? new Date(voucher.ended_date).toLocaleDateString("vi-VN")
                        : "Không có hạn"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleClaimVoucher(voucher.id)}
                  disabled={claimedVouchers.includes(voucher.id)}
                  className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
                    claimedVouchers.includes(voucher.id)
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-pink-600 hover:bg-pink-700"
                  }`}
                >
                  {claimedVouchers.includes(voucher.id) ? "Đã có" : "Thu thập"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 