"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, ChevronRight, HelpCircle } from "lucide-react";
import { API_BASE_URL } from "@/config/config";
import Cookies from "js-cookie";
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
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showVoucherModal, setShowVoucherModal] = useState<boolean>(false);
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
      setSelectedItems((prev) => prev.filter((id) => id !== product_id));
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };

  const formatPrice = (price: number) => `${price.toLocaleString()} VND`;

  const subtotal = useMemo(
    () =>
      cart
        .filter((item) => selectedItems.includes(item.sku.product_id))
        .reduce((sum, item) => sum + item.sku.price * item.quantity, 0),
    [cart, selectedItems]
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
    if (voucher) {
      localStorage.setItem("selectedVoucher", JSON.stringify(voucher));
    } else {
      localStorage.removeItem("selectedVoucher");
    }
    setShowVoucherModal(false);
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

    if (selectedItems.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Chưa chọn sản phẩm!",
        text: "Hãy chọn ít nhất một sản phẩm để thanh toán.",
        confirmButtonText: "OK",
      });
      return;
    }

    router.push("/checkout");
  };

  const toggleSelectItem = (product_id: string) => {
    setSelectedItems((prev) =>
      prev.includes(product_id)
        ? prev.filter((id) => id !== product_id)
        : [...prev, product_id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === cart.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.map((item) => item.sku.product_id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-4">
      <div className="max-w-7xl mx-auto px-4 flex gap-4">
        {/* Left: Product Selection */}
        <div className="w-2/3 bg-white rounded-lg shadow">
          <div className="p-4 flex items-center border-b">
            <input
              type="checkbox"
              checked={cart.length > 0 && selectedItems.length === cart.length}
              onChange={toggleSelectAll}
              className="mr-4"
            />
            <span className="text-lg font-medium text-gray-900">
              Chọn Tất Cả ({cart.length})
            </span>
            <button
              onClick={() => setSelectedItems([])}
              className="ml-4 text-red-500 hover:text-red-700"
            >
              Xóa
            </button>
          </div>
          {loading ? (
            <div className="p-6 text-center text-gray-600">Đang tải...</div>
          ) : cart.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {cart.map((item) => (
                <div key={item.id} className="p-4 flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.sku.product_id)}
                    onChange={() => toggleSelectItem(item.sku.product_id)}
                    className="mr-4"
                  />
                  <div className="w-16 h-16 flex-shrink-0">
                    <Image
                      src={item.sku.image_url}
                      alt={item.sku.product.name}
                      width={64}
                      height={64}
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-base font-medium text-gray-900">
                            {item.sku.product.name}
                          </h3>
                        </div>
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
                    <div className="mt-2 flex justify-between items-center">
                      <div className="flex items-center border rounded-lg">
                        <button
                          className="p-2 hover:bg-gray-50 text-gray-600"
                          onClick={() => handleQuantityChange(item.sku.product_id, item.quantity - 1)}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 text-gray-600">{item.quantity}</span>
                        <button
                          className="p-2 hover:bg-gray-50 text-gray-600"
                          onClick={() => handleQuantityChange(item.sku.product_id, item.quantity + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-base font-medium text-gray-900">
                        ₫{(item.sku.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">Giỏ hàng trống</div>
          )}
          {/* <div className="p-4 border-t flex justify-between items-center">
            <div className="flex items-center">
              <button className="text-gray-500 hover:text-gray-700">Lưu vào mục Đã thích</button>
            </div>
            <button className="text-gray-500 hover:text-gray-700">Tìm sản phẩm tương tự</button>
          </div> */}
        </div>

        {/* Right: Selected Products, Voucher, and Summary */}
        <div className="w-1/3 space-y-4">
          {/* Selected Products */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Sản phẩm đã chọn</h2>
            {selectedItems.length > 0 ? (
              <div className="space-y-4">
                {cart
                  .filter((item) => selectedItems.includes(item.sku.product_id))
                  .map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="w-12 h-12 flex-shrink-0">
                        <Image
                          src={item.sku.image_url}
                          alt={item.sku.product.name}
                          width={48}
                          height={48}
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">{item.sku.product.name}</h3>
                        <div className="text-xs text-gray-600">
                          {item.sku.variant_values.map((v) => v.value).join(", ") || "Không có biến thể"}
                        </div>
                        <div className="text-sm text-gray-900">x{item.quantity}</div>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        ₫{(item.sku.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-gray-500 text-sm">Chưa có sản phẩm được chọn</div>
            )}
          </div>

          {/* Voucher Selection */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              Chọn Shopee Voucher
              <HelpCircle className="w-5 h-5 ml-2 text-gray-500" />
            </h2>
            <div className="relative">
              <button
                className="w-full p-2 border rounded-md text-left flex justify-between items-center"
                onClick={() => setShowVoucherModal(true)}
              >
                <span>{selectedVoucher ? selectedVoucher.title : "Chọn hoặc nhập mã"}</span>
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </button>
              {showVoucherModal && (
                <div className="absolute top-0 left-0 w-full bg-white border rounded-md shadow-lg z-10">
                  <div className="p-4">
                    <div className="flex mb-4">
                      <button className="flex-1 py-2 text-center border-b-2 border-blue-500 text-blue-500">
                        Mã Miễn Phí Vận Chuyển
                      </button>
                      {/* <button className="flex-1 py-2 text-center text-gray-500">
                        Mã Shopee Voucher
                      </button> */}
                      <button className="flex-1 py-2 text-center text-gray-500">
                        Áp Dụng
                      </button>
                    </div>
                    <div className="spaceoid-y-4">
                      {uniqueVouchers.map((voucher) => (
                        <div
                          key={voucher.id}
                          className="border rounded-md p-4 flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <div className="bg-teal-100 p-2 rounded-md mr-4">
                              <span className="text-teal-500 font-medium">
                                {voucher.type === "percent" ? "THOẢI MÃN" : "FREE SHIP"}
                              </span>
                              <div className="text-sm text-teal-500">Mã voucher</div>
                            </div>
                            <div>
                              <div className="text-base font-medium">
                                Giảm tối đa ₫{voucher.max_discount_value.toLocaleString()} Đơn Tối Thiểu ₫{voucher.min_order_value.toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-500">
                                Sắp hết hạn: Còn 1 ngày Điều Kiện
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleVoucherChange(voucher)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            Áp dụng
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-4">
                      <button
                        onClick={() => setShowVoucherModal(false)}
                        className="py-2 px-4 border rounded-md text-gray-500"
                      >
                        Trở Lại
                      </button>
                      <button
                        onClick={() => handleVoucherChange(selectedVoucher)}
                        className="py-2 px-4 bg-red-500 text-white rounded-md"
                      >
                        OK
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Tổng cộng</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Tổng cộng ({selectedItems.length} sản phẩm):</span>
                <span>₫{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Giảm giá:</span>
                <span>-₫{discount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-medium text-gray-900">
                <span>Tổng tiền:</span>
                <span>₫{total.toLocaleString()}</span>
              </div>
            </div>
            <Link
              href="#"
              className={`block mt-4 py-3 px-6 rounded-lg font-medium text-white text-center ${
                selectedItems.length > 0 && !loading
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={handleCheckout}
            >
              Mua Hàng
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}