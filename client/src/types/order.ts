export interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  items: OrderItem[];
  shipping_address: ShippingAddress;
  payment_method: string;
}

export interface OrderItem {
  id: string;
  sku_id: string;
  quantity: number;
  price: number;
  product_name: string;
}

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  address: string;
  phone_number: string;
  province_code: string;
  district_code: string;
  ward_code: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface UserAddress {
  id: string;
  name: string;
  address: string;
  phone_number: string;
  default: string;
  province: {
    code: string;
    name: string;
  };
  district: {
    code: string;
    name: string;
  };
  ward: {
    code: string;
    name: string;
  };
} 