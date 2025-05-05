import { API_BASE_URL } from "@/config/config";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

export interface Order {
  id: string;
  user_email: string;
  total_amount: number;
  payment_method: "cod" | "bank";
  status: string;
  items: Array<{
    sku_id: string;
    quantity: number;
    price?: number;
  }>;
  address: {
    full_name: string;
    address: string;
    phone_number: string;
    province_code: string;
    district_code: string;
    ward_code: string;
  };
  note?: string;
  first_name: string;
  last_name: string;
  shipping_fee: number;
  voucher_id?: string | null;
  created_at: string;
  updated_at: string;
  payment_url?: string;
}

const validateString = (value: string, field: string) => {
  if (!value) throw new Error(`${field} không được để trống`);
  return value;
};

const validatePositiveNumber = (value: number, field: string) => {
  if (value <= 0) throw new Error(`${field} phải là số dương`);
  return value;
};

export const handleApiError = (error: unknown, defaultMessage: string) => {
  const message = error instanceof Error ? error.message : defaultMessage;
  Swal.fire({
    icon: "error",
    title: "Lỗi",
    text: message,
  });
  throw error;
};

export const getOrderDetails = async (orderId: string): Promise<Order | undefined> => {
  try {
    validateString(orderId, "ID đơn hàng");

    const userToken = Cookies.get("accessToken");
    const userEmail = Cookies.get("userEmail");

    if (!userToken || !userEmail) {
      throw new Error("Không được phép truy cập");
    }

    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Lỗi khi lấy đơn hàng: ${response.status}`);
      } else {
        throw new Error(`Lỗi server: ${response.status}`);
      }
    }

    const result = await response.json();
    if (!result.data) {
      throw new Error("Không tìm thấy dữ liệu đơn hàng");
    }

    return result.data;
  } catch (error) {
    handleApiError(error, "Không thể lấy thông tin đơn hàng.");
  }
};

export const cancelOrder = async (orderId: string): Promise<void> => {
  try {
    validateString(orderId, "ID đơn hàng");

    const userToken = Cookies.get("accessToken");
    const userEmail = Cookies.get("userEmail");

    if (!userToken || !userEmail) {
      throw new Error("Không được phép truy cập");
    }

    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Lỗi khi hủy đơn hàng: ${response.status}`);
      } else {
        throw new Error(`Lỗi server: ${response.status}`);
      }
    }
  } catch (error) {
    handleApiError(error, "Không thể hủy đơn hàng.");
  }
};

export const createQuickOrder = async (skuId: string, quantity: number): Promise<Order | undefined> => {
  try {
    validateString(skuId, "ID SKU");
    validatePositiveNumber(quantity, "Số lượng");

    const userToken = Cookies.get("accessToken");
    const userEmail = Cookies.get("userEmail");

    if (!userToken || !userEmail) {
      throw new Error("Không được phép truy cập");
    }

    const userAddresses = await fetch(`${API_BASE_URL}/users/addresses`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    });

    if (!userAddresses.ok) {
      throw new Error("Không thể lấy danh sách địa chỉ");
    }

    const addresses = (await userAddresses.json()).data;
    const defaultAddress = addresses.find((addr: any) => addr.default === "default");

    const response = await fetch(`${API_BASE_URL}/orders/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        orders: [{
          sku_id: skuId,
          quantity: quantity,
        }],
        first_name: defaultAddress?.name?.split(" ")[0] || "",
        last_name: defaultAddress?.name?.split(" ").slice(1).join(" ") || "",
        address: defaultAddress?.address || "",
        phone_number: defaultAddress?.phone_number || "",
        province_code: defaultAddress?.province.code || "",
        district_code: defaultAddress?.district.code || "",
        ward_code: defaultAddress?.ward.code || "",
        payment_method: "cod",
      }),
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Lỗi khi tạo đơn hàng nhanh: ${response.status}`);
      } else {
        throw new Error(`Lỗi server: ${response.status} - Phương thức không được phép hoặc điểm cuối không tồn tại`);
      }
    }

    const result = await response.json();
    if (!result.data) {
      throw new Error("Không tìm thấy dữ liệu đơn hàng");
    }

    return result.data;
  } catch (error) {
    handleApiError(error, "Không thể tạo đơn hàng nhanh.");
  }
}; 