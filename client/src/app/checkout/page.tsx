"use client";

import { useState, useEffect } from "react";
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
  shipping: number;
  total: number;
}

interface FormData {
  cardNumber: string;
  expiry: string;
  cvv: string;
}

interface FormErrors {
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
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

export default function CheckoutOrder() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cod" | "bank">("card");
  const [cartSummary, setCartSummary] = useState<CartSummary>({
    items: [],
    subtotal: 0,
    shipping: 0,
    total: 0,
  });
  const [discountCode, setDiscountCode] = useState<string>("");
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [discountError, setDiscountError] = useState<string>("");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderDate, setOrderDate] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
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
  const [provinces] = useState<{ code: string; name: string }[]>([
    { code: "01", name: "Hà Nội" },
    { code: "79", name: "TP. Hồ Chí Minh" },
    { code: "48", name: "Đà Nẵng" },
    { code: "02", name: "Hải Phòng" },
    { code: "31", name: "Hải Dương" },
  ]);
  const [districts, setDistricts] = useState<{ code: string; name: string }[]>([]);
  const [wards, setWards] = useState<{ code: string; name: string }[]>([]);

  const districtData: { [key: string]: { code: string; name: string }[] } = {
    "01": [
      { code: "001", name: "Quận Ba Đình" },
      { code: "002", name: "Quận Hoàn Kiếm" },
      { code: "003", name: "Quận Tây Hồ" },
    ],
    "79": [
      { code: "760", name: "Quận 1" },
      { code: "761", name: "Quận 2" },
      { code: "762", name: "Quận 3" },
    ],
    "48": [
      { code: "490", name: "Quận Hải Châu" },
      { code: "491", name: "Quận Thanh Khê" },
    ],
    "02": [
      { code: "303", name: "Quận Hồng Bàng" },
      { code: "304", name: "Quận Ngô Quyền" },
    ],
    "31": [
      { code: "288", name: "TP. Hải Dương" },
      { code: "289", name: "Huyện Cẩm Giàng" },
    ],
  };

  const wardData: { [key: string]: { code: string; name: string }[] } = {
    "001": [
      { code: "00001", name: "Phường Phúc Xá" },
      { code: "00002", name: "Phường Trúc Bạch" },
    ],
    "002": [
      { code: "00004", name: "Phường Hàng Mã" },
      { code: "00005", name: "Phường Hàng Bông" },
    ],
    "003": [
      { code: "00007", name: "Phường Xuân La" },
      { code: "00008", name: "Phường Nhật Chiêu" },
    ],
    "760": [
      { code: "26740", name: "Phường Bến Nghé" },
      { code: "26741", name: "Phường Bến Thành" },
    ],
    "761": [
      { code: "26743", name: "Phường Thảo Điền" },
      { code: "26744", name: "Phường An Phú" },
    ],
    "762": [
      { code: "26746", name: "Phường Võ Thị Sáu" },
      { code: "26747", name: "Phường Đa Kao" },
    ],
    "490": [
      { code: "20260", name: "Phường Hải Châu I" },
      { code: "20261", name: "Phường Hải Châu II" },
    ],
    "491": [
      { code: "20263", name: "Phường Thanh Khê Đông" },
      { code: "20264", name: "Phường Thanh Khê Tây" },
    ],
    "303": [
      { code: "11620", name: "Phường Quán Toan" },
      { code: "11621", name: "Phường Hùng Vương" },
    ],
    "304": [
      { code: "11623", name: "Phường Đông Hải 1" },
      { code: "11624", name: "Phường Đông Hải 2" },
    ],
    "288": [
      { code: "10540", name: "Phường Cẩm Thượng" },
      { code: "10541", name: "Phường Bình Hàn" },
    ],
    "289": [
      { code: "10543", name: "Xã Cẩm Hưng" },
      { code: "10544", name: "Xã Cẩm Phúc" },
    ],
  };

  // Cập nhật danh sách quận/huyện khi tỉnh/thành phố thay đổi
  useEffect(() => {
    if (shippingInfo.province_code) {
      const availableDistricts = districtData[shippingInfo.province_code] || [];
      setDistricts(availableDistricts);
      setShippingInfo((prev) => ({ ...prev, district_code: "", ward_code: "" }));
      setWards([]);
    } else {
      setDistricts([]);
      setWards([]);
      setShippingInfo((prev) => ({ ...prev, district_code: "", ward_code: "" }));
    }
  }, [shippingInfo.province_code]);

  // Cập nhật danh sách phường/xã khi quận/huyện thay đổi
  useEffect(() => {
    if (shippingInfo.district_code) {
      const availableWards = wardData[shippingInfo.district_code] || [];
      setWards(availableWards);
      setShippingInfo((prev) => ({ ...prev, ward_code: "" }));
    } else {
      setWards([]);
      setShippingInfo((prev) => ({ ...prev, ward_code: "" }));
    }
  }, [shippingInfo.district_code]);

  // Lấy dữ liệu giỏ hàng
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
          const subtotal = items.reduce(
            (sum: number, item: CartItem) => sum + (item.sku?.price || 0) * (item.quantity || 0),
            0
          );
          const shipping = subtotal > 0 ? 30000 : 0;
          const total = subtotal + shipping - appliedDiscount;

          setCartSummary({ items, subtotal, shipping, total });
          setOrderId(`OD-${Date.now()}`);
          setOrderDate(new Date().toISOString().split("T")[0]);
        } else {
          setCartSummary({ items: [], subtotal: 0, shipping: 0, total: 0 });
        }
      } catch (error: unknown) {
        console.error("Lỗi khi lấy giỏ hàng:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi tải giỏ hàng",
          text: "Không thể tải dữ liệu giỏ hàng. Vui lòng thử lại.",
        });
        setCartSummary({ items: [], subtotal: 0, shipping: 0, total: 0 });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartData();
  }, [router, appliedDiscount]);

  const formatPrice = (price: number) => `${(price || 0).toLocaleString()} VND`;

  const handleApplyDiscount = () => {
    if (discountCode === "SALE10") {
      const discountAmount = cartSummary.subtotal * 0.1;
      setAppliedDiscount(discountAmount);
      setCartSummary((prev) => ({
        ...prev,
        total: prev.subtotal + prev.shipping - discountAmount,
      }));
      setDiscountError("");
    } else {
      setAppliedDiscount(0);
      setCartSummary((prev) => ({
        ...prev,
        total: prev.subtotal + prev.shipping,
      }));
      setDiscountError("Mã giảm giá không hợp lệ");
    }
  };

  const validateForm = () => {
    const errors: FormErrors = {};
    if (paymentMethod === "card") {
      const cardNumber = formData.cardNumber.replace(/\s/g, "");
      if (!cardNumber || cardNumber.length !== 16 || isNaN(Number(cardNumber))) {
        errors.cardNumber = "Số thẻ phải là 16 chữ số.";
      }
      if (!formData.expiry || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiry)) {
        errors.expiry = "Tháng hết hạn phải có định dạng MM/YY.";
      }
      if (!formData.cvv || !/^\d{3,4}$/.test(formData.cvv)) {
        errors.cvv = "CVV phải là 3-4 chữ số.";
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleShippingInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [id]: value }));
  };

  const handleCreateOrder = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);

    const userToken = Cookies.get("accessToken");
    const userEmail = Cookies.get("userEmail");

    if (!userToken || !userEmail) {
      console.warn("No token or email found, redirecting to login.");
      Cookies.remove("accessToken");
      Cookies.remove("userEmail");
      router.push("/login");
      setLoading(false);
      return;
    }

    if (
      !shippingInfo.full_name ||
      !shippingInfo.address ||
      !shippingInfo.phone_number ||
      !shippingInfo.province_code ||
      !shippingInfo.district_code ||
      !shippingInfo.ward_code
    ) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Vui lòng điền đầy đủ thông tin giao hàng (họ tên, địa chỉ, tỉnh/thành phố, quận/huyện, phường/xã và số điện thoại).",
      });
      setLoading(false);
      return;
    }

    if (paymentMethod === "card" && !validateForm()) {
      setLoading(false);
      return;
    }

    if (paymentMethod === "bank") {
      try {
        const [firstName, ...lastNameParts] = shippingInfo.full_name.trim().split(" ");
        const lastName = lastNameParts.join(" ") || "";

        const orderData = {
          user_email: userEmail,
          orders: cartSummary.items.map((item) => ({
            sku_id: item.sku_id || null,
            quantity: item.quantity || 0,
          })),
          voucher_ids: [],
          address: shippingInfo.address,
          phone_number: shippingInfo.phone_number,
          payment_method: paymentMethod,
          note: shippingInfo.note || "",
          first_name: firstName,
          last_name: lastName,
          province_code: shippingInfo.province_code,
          district_code: shippingInfo.district_code,
          ward_code: shippingInfo.ward_code,
          // redirect_url: "${FRONTEND_URL}/PaymentResult"   , // Thêm redirect_url
        };

        console.log("Sending order data:", orderData); // Log dữ liệu gửi đi
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
          console.error("API Error Response:", errorData);
          throw new Error(
            `Tạo đơn hàng thất bại: ${response.status} - ${errorData.message || response.statusText}`
          );
        }

        const result = await response.json();
        console.log("API Response:", result);
        const paymentUrl = result.data?.payment_url;

        if (paymentUrl) {
          console.log("Redirecting to payment URL:", paymentUrl);
          window.location.href = paymentUrl;
        } else {
          console.error("Payment URL not found in response:", result);
          throw new Error("No payment URL received");
        }
      } catch (error) {
        console.error("Bank payment initiation failed:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi Thanh Toán",
          text: "Không thể khởi tạo thanh toán qua ngân hàng. Vui lòng thử lại.",
        });
      } finally {
        setLoading(false);
      }
      return;
    }

    const [firstName, ...lastNameParts] = shippingInfo.full_name.trim().split(" ");
    const lastName = lastNameParts.join(" ") || "";

    const orderData = {
      user_email: userEmail,
      orders: cartSummary.items.map((item) => ({
        sku_id: item.sku_id || null,
        quantity: item.quantity || 0,
      })),
      voucher_ids: [],
      address: shippingInfo.address,
      phone_number: shippingInfo.phone_number,
      payment_method: paymentMethod,
      note: shippingInfo.note || "",
      first_name: firstName,
      last_name: lastName,
      province_code: shippingInfo.province_code,
      district_code: shippingInfo.district_code,
      ward_code: shippingInfo.ward_code,
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
        throw new Error(
          `Tạo đơn hàng thất bại: ${response.status} - ${errorData.message || response.statusText}`
        );
      }

      for (const item of cartSummary.items) {
        await fetch(`${API_BASE_URL}/carts/${item.sku.product.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        });
      }

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
    } catch (error: unknown) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      let errorMessage = "Có lỗi xảy ra khi tạo đơn hàng.";
      if (error instanceof Error && error.message.includes("Undefined array key")) {
        errorMessage = "Dữ liệu gửi lên không đầy đủ. Vui lòng kiểm tra thông tin và thử lại.";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: errorMessage,
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
                      paymentMethod === "cod"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setPaymentMethod("cod")}
                    disabled={isLoading}
                  >
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-pink-600" />
                      <div>
                        <div className="font-medium text-black">COD</div>
                        <div className="text-sm text-gray-500">Thanh toán khi nhận hàng</div>
                      </div>
                    </div>
                  </button>
                  <button
                    className={`flex-1 border rounded-lg p-4 text-left ${
                      paymentMethod === "bank"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setPaymentMethod("bank")}
                    disabled={isLoading}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-pink-600" />
                      <div>
                        <div className="font-medium text-black">Bank</div>
                        <div className="text-sm text-gray-500">Thanh toán qua ngân hàng</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Thông tin giao hàng</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    value={shippingInfo.full_name}
                    onChange={handleShippingInfoChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập họ và tên"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={shippingInfo.email}
                    onChange={handleShippingInfoChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập email"
                  />
                </div>
                <div>
                  <label htmlFor="province_code" className="block text-sm font-medium text-gray-700 mb-1">
                    Tỉnh/Thành phố
                  </label>
                  <select
                    id="province_code"
                    value={shippingInfo.province_code}
                    onChange={handleShippingInfoChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Chọn tỉnh/thành phố</option>
                    {provinces.map((province) => (
                      <option key={province.code} value={province.code}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="district_code" className="block text-sm font-medium text-gray-700 mb-1">
                    Quận/Huyện
                  </label>
                  <select
                    id="district_code"
                    value={shippingInfo.district_code}
                    onChange={handleShippingInfoChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={!shippingInfo.province_code}
                  >
                    <option value="">Chọn quận/huyện</option>
                    {districts.map((district) => (
                      <option key={district.code} value={district.code}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="ward_code" className="block text-sm font-medium text-gray-700 mb-1">
                    Phường/Xã
                  </label>
                  <select
                    id="ward_code"
                    value={shippingInfo.ward_code}
                    onChange={handleShippingInfoChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={!shippingInfo.district_code}
                  >
                    <option value="">Chọn phường/xã</option>
                    {wards.map((ward) => (
                      <option key={ward.code} value={ward.code}>
                        {ward.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ chi tiết
                  </label>
                  <input
                    type="text"
                    id="address"
                    value={shippingInfo.address}
                    onChange={handleShippingInfoChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập địa chỉ chi tiết (số nhà, đường)"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    id="phone_number"
                    value={shippingInfo.phone_number}
                    onChange={handleShippingInfoChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập số điện thoại"
                    required
                  />
                </div>
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
                        key={item.sku?.id || Math.random()}
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
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                        placeholder="Mã giảm giá"
                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                        disabled={isLoading}
                      />
                      <button
                        onClick={handleApplyDiscount}
                        disabled={isLoading}
                        className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
                      >
                        Dùng mã
                      </button>
                    </div>
                    {appliedDiscount > 0 && (
                      <p className="text-sm text-green-600 mt-2">
                        Đã áp dụng giảm giá: {formatPrice(appliedDiscount)}
                      </p>
                    )}
                    {discountError && (
                      <p className="text-sm text-red-600 mt-2">{discountError}</p>
                    )}
                  </div>

                  <div className="pt-4">
                    {/* <div className="flex justify-between text-gray-600">
                      <span>Tạm tính</span>
                      <span>{formatPrice(cartSummary.subtotal)}</span>
                    </div> */}
                    {/* <div className="flex justify-between text-gray-600">
                      <span>Phí vận chuyển</span>
                      <span>{formatPrice(cartSummary.shipping)}</span>
                    </div> */}
                    {appliedDiscount > 0 && (
                      <div className="flex justify-between text-gray-600">
                        <span>Giảm giá</span>
                        <span>-{formatPrice(appliedDiscount)}</span>
                      </div>
                    )}
                    <div className="border-t pt-4 mt-4 text-lg font-medium text-gray-900 flex justify-between">
                      <span>Tổng cộng</span>
                      <span>{formatPrice(cartSummary.subtotal)}</span>
                    </div>
                  </div>
                </>
              )}

              <button
                onClick={handleCreateOrder}
                disabled={isLoading || loading || cartSummary.items.length === 0}
                className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 w-full mt-6 disabled:bg-gray-400"
              >
                {loading ? "Đang xử lý..." : "Đặt hàng"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}