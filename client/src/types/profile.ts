export interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  avatar?: string;
  role?: "admin" | "user";
  sex: "male" | "female" | "other";
  vouchers: Array<{
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
    pivot: {
      user_id: number;
      voucher_id: number;
    };
  }>;
}

export interface Address {
  id: number;
  user_id: number;
  name: string;
  phone_number: string;
  address: string;
  default: string;
  ward: {
    id: number;
    full_name: string;
  };
  district: {
    id: number;
    full_name: string;
  };
  province: {
    id: number;
    full_name: string;
  };
}

export interface Order {
  id: number;
  user_id: number;
  orderNumber: string;
  total_amount: number;
  status: string;
  created_at: string;
  date: string;
  shipping: number;
  totalAmount: number;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  name: string;
  quantity: number;
  price: number;
  variants?: Array<{
    name: string;
    value: string;
  }>;
  product: {
    id: number;
    name: string;
    image: string;
  };
}

export interface WishlistItem {
  id: number;
  user_id: number;
  product_id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  image: string;
  inStock: boolean;
}

export interface Voucher {
  id: number;
  admin_id: number;
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
  pivot: {
    user_id: number;
    voucher_id: number;
  };
} 