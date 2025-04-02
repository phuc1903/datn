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
    variant: {
      name: string;
    };
    value: string;
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
}

export interface ComboProduct extends Product {
  date_start: string;
  date_end: string;
} 