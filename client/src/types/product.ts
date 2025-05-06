export interface Variant {
  name: string;
  value: string;
}

export interface Sku {
  id: string;
  price: number;
  promotion_price: number;
  quantity: number;
  image_url?: string;
  variant_values: Array<{
    id: number;
    value: string;
    variant_id: number;
    pivot?: {
      sku_id: string | number;
      variant_value_id: number;
    };
    variant: {
      id: number;
      name: string;
    };
  }>;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  image_url: string;
  price: number;
  status: string;
  is_hot: boolean;
  created_at: string;
  skus: Sku[];
  images: Array<{ image_url: string }>;
  categories?: Category[];
}

export interface CartItem {
  sku_id: string;
  name: string;
  image_url: string;
  price: number;
  quantity: number;
  variants: Variant[];
  product_id: number;
}

export interface ComboProduct extends Product {
  date_start: string;
  date_end: string;
} 