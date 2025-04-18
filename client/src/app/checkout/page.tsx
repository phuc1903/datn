"use client";

import { useState, useEffect, useMemo } from "react";
import { CreditCard, Truck, ChevronLeft } from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { API_BASE_URL } from "@/config/config";
import Image from "next/image";

interface VariantValue {
  value: string;
}

interface Sku {
  id: string;
  price: number;
  image_url: string;
  product: {
    name: string;
    id: string;
  };
  variant_values: VariantValue[];
}

interface CartItem {
  sku: Sku;
  sku_id: string;
  quantity: number;
}

interface CartSummary {
  items: CartItem[];
  subtotal: number;
  total: number;
}

interface ShippingInfo {
  full_name: string;
  email: string;
  address: string;
  phone_number: string;
  note: string;
  province_code: string;
  district_code: string;
  ward_code: string;
}

interface UserAddress {
  id: string;
  name: string;
  address: string;
  phone_number: string;
  province: { full_name: string; code: string };
  district: { full_name: string; code: string };
  ward: { full_name: string; code: string };
  default: string;
}

interface Voucher {
  id: string;
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

export default function CheckoutOrder() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<"Tiền mặt" | "Momo">("Tiền mặt");
  const [cartSummary, setCartSummary] = useState<CartSummary>({
    items: [],
    subtotal: 0,
    total: 0,
  });
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderDate, setOrderDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    full_name: "",
    email: "",
    address: "",
    phone_number: "",
    note: "",
    province_code: "",
    district_code: "",
    ward_code: "",
  });
  const [userAddresses, setUserAddresses] = useState<UserAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");

  useEffect(() => {
    const fetchUserAddresses = async () => {
      const userToken = Cookies.get("accessToken");
      const userData = Cookies.get("userData");

      if (!userToken || !userData) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/users/addresses`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Lỗi lấy địa chỉ: ${response.status}`);
        }

        const result = await response.json();
        const addresses: UserAddress[] = result.data || [];
        setUserAddresses(addresses);

        const defaultAddress = addresses.find((addr) => addr.default === "default");
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
          setShippingInfo({
            full_name: defaultAddress.name,
            email: JSON.parse(userData).email,
            address: defaultAddress.address,
            phone_number: defaultAddress.phone_number,
            note: "",
            province_code: defaultAddress.province.code,
            district_code: defaultAddress.district.code,
            ward_code: defaultAddress.ward.code,
          });
        }
      } catch (error) {
        console.error("Lỗi khi lấy địa chỉ:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không thể tải địa chỉ. Vui lòng thử lại.",
        });
      }
    };

    fetchUserAddresses();
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      const userToken = Cookies.get("accessToken");
      const userData = Cookies.get("userData");

      if (!userToken || !userData) {
        router.push("/login");
        return;
      }

      try {
        setIsLoading(true);

        const cartResponse = await fetch(`${API_BASE_URL}/users/carts`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        });

        if (!cartResponse.ok) {
          throw new Error("Failed to fetch cart");
        }

        const cartResult = await cartResponse.json();
        let items: CartItem[] = [];
        let subtotal = 0;

        const parsedUserData = JSON.parse(userData);
        if (cartResult.data?.email === parsedUserData.email) {
          items = cartResult.data.carts || [];
          subtotal = items.reduce(
            (sum, item) => sum + (item.sku?.price || 0) * (item.quantity || 0),
            0
          );
        }

        // Load selected voucher from localStorage
        const savedVoucher = localStorage.getItem("selectedVoucher");
        let voucher: Voucher | null = null;
        if (savedVoucher) {
          voucher = JSON.parse(savedVoucher);
          setSelectedVoucher(voucher);
        }

        const discount = voucher ? calculateDiscount(subtotal, voucher) : 0;
        const total = subtotal - discount;

        setCartSummary({ items, subtotal, total });
        setAppliedDiscount(discount);
        setOrderId(`OD-${Date.now()}`);
        setOrderDate(new Date().toISOString().split("T")[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi tải dữ liệu",
          text: "Không thể tải dữ liệu đơn hàng. Vui lòng thử lại.",
        });
        setCartSummary({ items: [], subtotal: 0, total: 0 });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const formatPrice = (price: number) => `${(price || 0).toLocaleString()} VND`;

  const calculateDiscount = (subtotal: number, voucher: Voucher): number => {
    if (!voucher || subtotal < voucher.min_order_value) return 0;
    if (voucher.type === "percent") {
      const discountValue = (subtotal * voucher.discount_value) / 100;
      return Math.min(discountValue, voucher.max_discount_value);
    }
    return Math.min(voucher.discount_value, voucher.max_discount_value);
  };

  const clearVoucher = (message: string) => {
    Swal.fire({
      icon: "info",
      title: "Thông báo",
      text: message,
    });
    
    // Xóa voucher đã lưu
    localStorage.removeItem("selectedVoucher");
    setSelectedVoucher(null);
    
    // Cập nhật tổng tiền không bao gồm giảm giá
    const total = cartSummary.subtotal;
    setCartSummary({...cartSummary, total});
    setAppliedDiscount(0);
  };

  const handleShippingInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddressSelection = (address: UserAddress) => {
    setSelectedAddressId(address.id);
    setShippingInfo({
      full_name: address.name,
      email: JSON.parse(Cookies.get("userData") || "{}").email || "",
      address: address.address,
      phone_number: address.phone_number,
      note: "",
      province_code: address.province.code,
      district_code: address.district.code,
      ward_code: address.ward.code,
    });
  };

  const handleCreateOrder = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);

    const userToken = Cookies.get("accessToken");
    const userData = Cookies.get("userData");

    if (!userToken || !userData) {
      router.push("/login");
      setLoading(false);
      return;
    }

    const parsedUserData = JSON.parse(userData);

    if (!selectedAddressId) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Vui lòng chọn một địa chỉ giao hàng.",
      });
      setLoading(false);
      return;
    }

    if (!shippingInfo.address || !shippingInfo.phone_number) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Địa chỉ và số điện thoại không được để trống.",
      });
      setLoading(false);
      return;
    }

    const orders = cartSummary.items.map((item) => ({
      sku_id: item.sku_id || null,
      quantity: item.quantity || 0,
    }));

    const [firstName, ...lastNameParts] = shippingInfo.full_name.trim().split(" ");
    const lastName = lastNameParts.join(" ") || " ";

    const apiPaymentMethod = paymentMethod === "Tiền mặt" ? "cod" : "bank";

    const orderData = {
      user_email: parsedUserData.email,
      orders: orders,
      voucher_id: selectedVoucher ? selectedVoucher.id : null,
      address: shippingInfo.address,
      phone_number: shippingInfo.phone_number,
      payment_method: apiPaymentMethod,
      note: shippingInfo.note || "",
      first_name: firstName,
      last_name: lastName,
      province_code: shippingInfo.province_code,
      district_code: shippingInfo.district_code,
      ward_code: shippingInfo.ward_code,
      total_amount: cartSummary.total,
      shipping_fee: 0, // No shipping fee
    };

    try {
      const response = await fetch(`${API_BASE_URL}/orders/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
          Accept: "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Kiểm tra nếu đây là thông báo voucher đã sử dụng
        if (errorData.message) {
          // Xử lý các lỗi liên quan đến voucher
          if (errorData.message.includes("Voucher already used")) {
            clearVoucher("Voucher này đã được sử dụng trước đó. Vui lòng chọn voucher khác.");
            
            setLoading(false);
            return;
          } else if (errorData.message.includes("Voucher expired")) {
            clearVoucher("Voucher này đã hết hạn. Vui lòng chọn voucher khác.");
            
            setLoading(false);
            return;
          } else if (errorData.message.includes("Voucher out of stock")) {
            clearVoucher("Voucher này đã hết lượt sử dụng. Vui lòng chọn voucher khác.");
            
            setLoading(false);
            return;
          } else if (errorData.message.includes("Invalid voucher")) {
            clearVoucher("Mã voucher không hợp lệ. Vui lòng chọn voucher khác.");
            
            setLoading(false);
            return;
          } else if (errorData.message.includes("Minimum order value")) {
            clearVoucher("Giá trị đơn hàng chưa đạt mức tối thiểu để sử dụng voucher này.");
            
            setLoading(false);
            return;
          } else if (errorData.message.toLowerCase().includes("voucher")) {
            // Xử lý các trường hợp lỗi voucher khác
            clearVoucher("Có vấn đề với voucher của bạn. Vui lòng chọn voucher khác.");
            
            setLoading(false);
            return;
          }
        }
        
        throw new Error(
          `Tạo đơn hàng thất bại: ${errorData.message || response.statusText}`
        );
      }

      if (apiPaymentMethod === "bank") {
        const result = await response.json();
        const paymentUrl = result.data?.payment_url;
        if (paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          throw new Error("No payment URL received");
        }
      } else {
        for (const item of cartSummary.items) {
          await fetch(`${API_BASE_URL}/carts/${item.sku.product.id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
          });
        }

        // Clear selected voucher after successful order
        localStorage.removeItem("selectedVoucher");

        Swal.fire({
          title: "Đơn hàng đã được tạo thành công!",
          text: "Bạn muốn tiếp tục mua sắm hay xem đơn hàng?",
          icon: "success",
          showCancelButton: true,
          confirmButtonText: "Tiếp tục mua sắm",
          cancelButtonText: "Xem đơn hàng",
        }).then((result) => {
          if (result.isConfirmed) {
            router.push("/shop");
          } else {
            router.push("/order");
          }
        });
      }
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: error instanceof Error ? error.message : "Có lỗi xảy ra khi tạo đơn hàng.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl font-semibold text-pink-600 mb-4">Thanh toán</h1>
          <button
            onClick={() => router.push("/cart")}
            className="flex items-center gap-2 text-pink-400 hover:text-blue-700 mx-auto"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Quay lại giỏ hàng</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Phương thức thanh toán</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <button
                    className={`flex-1 border rounded-lg p-4 text-left ${
                      paymentMethod === "Tiền mặt"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setPaymentMethod("Tiền mặt")}
                    disabled={isLoading}
                  >
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-pink-600" />
                      <div>
                        <div className="font-medium text-black">Tiền mặt</div>
                        <div className="text-sm text-gray-500">Thanh toán khi nhận hàng</div>
                      </div>
                    </div>
                  </button>
                  <button
                    className={`flex-1 border rounded-lg p-4 text-left ${
                      paymentMethod === "Momo"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setPaymentMethod("Momo")}
                    disabled={isLoading}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-pink-600" />
                      <div>
                        <div className="font-medium text-black">Momo</div>
                        <div className="text-sm text-gray-500">Thanh toán qua ngân hàng</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Thông tin giao hàng</h2>
              <div className="space-y-4 text-black">
                {userAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-4 rounded-lg cursor-pointer ${
                      selectedAddressId === addr.id ? "bg-blue-50 border-blue-500 border" : "bg-gray-50"
                    }`}
                    onClick={() => handleAddressSelection(addr)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="mb-1">
                          {addr.name} - {addr.address}, {addr.ward.full_name}, {addr.district.full_name},{" "}
                          {addr.province.full_name}
                        </p>
                        <p className="text-gray-600">SĐT: {addr.phone_number}</p>
                        {addr.default === "default" && (
                          <span className="inline-block px-2 py-1 bg-pink-100 text-pink-600 text-xs rounded-full">
                            Mặc định
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {!userAddresses.length && <p className="text-gray-500">Chưa có địa chỉ nào được lưu</p>}
                <button
                  onClick={() => router.push("/address")}
                  className="inline-block bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
                >
                  + Thêm địa chỉ mới
                </button>
                <div>
                  <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
                    Ghi chú (tùy chọn)
                  </label>
                  <textarea
                    id="note"
                    value={shippingInfo.note}
                    onChange={handleShippingInfoChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ghi chú cho đơn hàng"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Thông tin đơn hàng</h2>
              {isLoading ? (
                <p className="text-gray-600">Đang tải...</p>
              ) : cartSummary.items.length === 0 ? (
                <p className="text-gray-600">Giỏ hàng của bạn đang trống.</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cartSummary.items.map((item) => (
                      <div
                        key={item.sku_id}
                        className="flex justify-between items-center"
                      >
                        <div className="w-24 h-24 flex-shrink-0">
                          <Image
                            src={item.sku?.image_url || "/placeholder-image.jpg"}
                            alt={item.sku?.product?.name || "Product"}
                            width={96}
                            height={96}
                            className="object-cover rounded-md"
                            onError={(e) => (e.currentTarget.src = "/placeholder-image.jpg")}
                          />
                        </div>
                        <div className="flex-1 px-4">
                          <p className="text-gray-900">
                            {item.sku?.product?.name || "Unknown Product"}
                          </p>
                          <div className="text-sm text-gray-600">
                            {item.sku?.variant_values?.length > 0
                              ? item.sku.variant_values.map((v) => v.value).join(", ")
                              : "Không có biến thể"}
                          </div>
                          <p className="text-sm text-gray-500">x {item.quantity || 0}</p>
                        </div>
                        <div className="text-gray-900">
                          {formatPrice((item.sku?.price || 0) * (item.quantity || 0))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Voucher đã áp dụng:
                    </label>
                    <div className="p-2 border rounded-md">
                      {selectedVoucher ? (
                        <p>
                          {selectedVoucher.title} (
                          {selectedVoucher.type === "percent"
                            ? `${selectedVoucher.discount_value}%`
                            : formatPrice(selectedVoucher.discount_value)}
                          )
                          {cartSummary.subtotal < selectedVoucher.min_order_value && (
                            <span className="text-red-600 text-sm ml-2">
                              (Cần thêm {formatPrice(selectedVoucher.min_order_value - cartSummary.subtotal)} để áp dụng)
                            </span>
                          )}
                        </p>
                      ) : (
                        <p>Không sử dụng voucher</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4">
                    <div className="flex justify-between text-gray-600">
                      <span>Tạm tính</span>
                      <span>{formatPrice(cartSummary.subtotal)}</span>
                    </div>
                    {appliedDiscount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Giảm giá</span>
                        <span>-{formatPrice(appliedDiscount)}</span>
                      </div>
                    )}
                    <div className="border-t pt-4 mt-4 text-lg font-medium text-gray-900 flex justify-between">
                      <span>Tổng cộng</span>
                      <span>{formatPrice(cartSummary.total)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCreateOrder}
                    disabled={isLoading || loading || cartSummary.items.length === 0}
                    className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 w-full mt-6 disabled:bg-gray-400"
                  >
                    {loading ? "Đang xử lý..." : "Đặt hàng"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}