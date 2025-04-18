"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, ChevronRight, CreditCard } from "lucide-react";
import { API_BASE_URL } from "@/config/config";
import Cookies from "js-cookie"; // Corrected import
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

interface VariantValue {
  value: string;
}

interface Sku {
  product_id: string;
  price: number;
  image_url: string;
  product: {
    name: string;
  };
  variant_values: VariantValue[];
}

interface CartItem {
  id: string;
  sku: Sku;
  quantity: number;
}

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

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const userToken = Cookies.get("accessToken");
      const userData = Cookies.get("userData");

      if (!userToken || !userData) {
        router.push("/login");
        return;
      }

      try {
        const parsedUserData = JSON.parse(userData);
        const cartResponse = await fetch(`${API_BASE_URL}/users/carts`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        });

        if (!cartResponse.ok) {
          throw new Error(`Cart fetch error: ${cartResponse.status}`);
        }

        const cartResult = await cartResponse.json();
        if (cartResult.data?.email === parsedUserData.email) {
          setCart(cartResult.data.carts || []);
        }

        const voucherResponse = await fetch(`${API_BASE_URL}/users/vouchers`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        });

        if (!voucherResponse.ok) {
          throw new Error(`Voucher fetch error: ${voucherResponse.status}`);
        }

        const voucherResult = await voucherResponse.json();
        if (voucherResult.status === "success") {
          setVouchers(voucherResult.data.vouchers || []);
          // Load previously selected voucher from localStorage
          const savedVoucher = localStorage.getItem("selectedVoucher");
          if (savedVoucher) {
            const parsedVoucher = JSON.parse(savedVoucher);
            setSelectedVoucher(parsedVoucher);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: "Không thể tải dữ liệu. Vui lòng thử lại sau.",
        });
        setCart([]);
        setVouchers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleQuantityChange = async (product_id: string, quantity: number) => {
    if (quantity < 1) return;
    try {
      const userToken = Cookies.get("accessToken");
      if (!userToken) return;

      const response = await fetch(`${API_BASE_URL}/carts/${product_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) throw new Error("Lỗi cập nhật số lượng");

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.sku.product_id === product_id ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng sản phẩm:", error);
    }
  };

  const handleRemove = async (product_id: string) => {
    try {
      const userToken = Cookies.get("accessToken");
      if (!userToken) return;

      await fetch(`${API_BASE_URL}/carts/${product_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });

      setCart((prevCart) => prevCart.filter((item) => item.sku.product_id !== product_id));
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };

  const formatPrice = (price: number) => `${price.toLocaleString()} VND`;

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.sku.price * item.quantity, 0),
    [cart]
  );

  const uniqueVouchers = useMemo(() => {
    const seenIds = new Set();
    return vouchers.filter((voucher) => {
      if (seenIds.has(voucher.id)) {
        return false;
      }
      seenIds.add(voucher.id);
      return true;
    });
  }, [vouchers]);

  const discount = useMemo(() => {
    if (!selectedVoucher || subtotal < selectedVoucher.min_order_value) return 0;
    if (selectedVoucher.type === "percent") {
      const discountValue = (subtotal * selectedVoucher.discount_value) / 100;
      return Math.min(discountValue, selectedVoucher.max_discount_value);
    }
    return Math.min(selectedVoucher.discount_value, selectedVoucher.max_discount_value);
  }, [selectedVoucher, subtotal]);

  const total = subtotal - discount;

  const handleVoucherChange = (voucher: Voucher | null) => {
    setSelectedVoucher(voucher);
    // Save selected voucher to localStorage
    if (voucher) {
      localStorage.setItem("selectedVoucher", JSON.stringify(voucher));
    } else {
      localStorage.removeItem("selectedVoucher");
    }
  };

  const handleCheckout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const userToken = Cookies.get("accessToken");

    if (!userToken) {
      Swal.fire({
        icon: "warning",
        title: "Bạn cần đăng nhập!",
        text: "Vui lòng đăng nhập để đặt hàng.",
        confirmButtonText: "Đăng nhập",
      }).then(() => {
        router.push("/login");
      });
      return;
    }

    if (cart.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Giỏ hàng trống!",
        text: "Hãy thêm sản phẩm vào giỏ trước khi thanh toán.",
        confirmButtonText: "Tiếp tục mua sắm",
      });
      return;
    }

    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-8 text-pink-500">Giỏ hàng của bạn</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              {loading ? (
                <div className="p-6 text-center text-gray-600">Đang tải...</div>
              ) : cart.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {cart.map((item) => (
                    <div key={item.id} className="p-6 flex gap-6">
                      <div className="w-24 h-24 flex-shrink-0">
                        <Image
                          src={item.sku.image_url}
                          alt={item.sku.product.name}
                          width={96}
                          height={96}
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-base font-medium text-gray-900">{item.sku.product.name}</h3>
                            <div className="text-sm text-gray-600">
                              {item?.sku?.variant_values && item.sku.variant_values.length > 0
                                ? item.sku.variant_values.map((v: VariantValue) => v.value).join(", ")
                                : "Không có biến thể"}
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemove(item.sku.product_id)}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <div className="flex items-center border rounded-lg">
                            <button
                              className="p-2 hover:bg-gray-50 text-pink-600"
                              onClick={() => handleQuantityChange(item.sku.product_id, item.quantity - 1)}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 text-pink-600">{item.quantity}</span>
                            <button
                              className="p-2 hover:bg-gray-50 text-pink-600"
                              onClick={() => handleQuantityChange(item.sku.product_id, item.quantity + 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="text-lg font-medium text-gray-900">
                            {formatPrice(item.sku.price * item.quantity)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-pink-500">Giỏ hàng trống</div>
              )}
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Tóm Tắt Đơn Hàng</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-base text-gray-600">
                  <span>Tạm tính</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="space-y-2">
                  <label className="text-base text-gray-600">Chọn voucher:</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={selectedVoucher?.id || ""}
                    onChange={(e) => {
                      const voucher = uniqueVouchers.find((v) => v.id === Number(e.target.value));
                      handleVoucherChange(voucher || null);
                    }}
                    disabled={loading}
                  >
                    <option value="">Không sử dụng voucher</option>
                    {uniqueVouchers.map((voucher) => (
                      <option key={voucher.id} value={voucher.id}>
                        {voucher.title} ({voucher.type === "percent"
                          ? `${voucher.discount_value}%`
                          : formatPrice(voucher.discount_value)})
                      </option>
                    ))}
                  </select>
                  {selectedVoucher && (
                    <div className="text-sm text-gray-500">
                      Giảm: {formatPrice(discount)}{" "}
                      (Tối thiểu: {formatPrice(selectedVoucher.min_order_value)})
                    </div>
                  )}
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-medium text-gray-900">
                    <span>Tổng cộng</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
              <Link
                href="#"
                className={`w-full mt-6 ${
                  cart.length > 0 && !loading 
                    ? "bg-pink-600 hover:bg-purple-500" 
                    : "bg-gray-400 cursor-not-allowed"
                } text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2`}
                onClick={handleCheckout}
              >
                <CreditCard className="w-5 h-5" />
                Tiến Hành Thanh Toán
              </Link>
              <Link
                href="/"
                className="w-full mt-4 text-pink-600 hover:text-purple-500 py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                Tiếp Tục Mua Sắm
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}