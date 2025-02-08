"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { StarIcon } from "lucide-react";
import { useParams } from "next/navigation";

interface VariantValue {
  id: number;
  value: string;
  variant_id: number;
  variant: {
    id: number;
    name: string;
  };
}

interface SKU {
  id: number;
  sku_code: string;
  price: number;
  promotion_price: number;
  quantity: number;
  image_url: string;
  variant_values: VariantValue[];
}

interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
}

interface Product {
  id: number;
  name: string;
  short_description: string;
  description: string;
  status: string;
  images: ProductImage[];
  skus: SKU[];
}

interface Review {
  id: number;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export default function ProductDetail() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSku, setSelectedSku] = useState<SKU | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [loading, setLoading] = useState(true);

  // Mock reviews data
  const reviews: Review[] = [
    {
      id: 1,
      user: "Nguyễn Thị A",
      rating: 5,
      comment: "Sản phẩm rất tốt, da mịn màng hơn sau 1 tuần sử dụng",
      date: "2024-01-15"
    },
    {
      id: 2,
      user: "Trần Văn B",
      rating: 4,
      comment: "Chất lượng tốt, đóng gói cẩn thận. Sẽ mua lại",
      date: "2024-01-10"
    }
  ];

  useEffect(() => {
    if (params.id) {
      fetch(`http://127.0.0.1:8000/api/products/${params.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            setProduct(data.data);
            setSelectedSku(data.data.skus[0]);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching product:", error);
          setLoading(false);
        });
    }
  }, [params.id]);

  if (loading) return <div className="text-center py-12">Đang tải...</div>;
  if (!product) return <div className="text-center py-12">Không tìm thấy sản phẩm</div>;

  const handleQuantityChange = (value: number) => {
    if (selectedSku) {
      const newQuantity = Math.max(1, Math.min(value, selectedSku.quantity));
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (product.status === "out_of_stock") {
      alert("Sản phẩm hiện đã hết hàng!");
      return;
    }
    // Add to cart logic here
    console.log("Added to cart:", {
      product: product.name,
      sku: selectedSku?.sku_code,
      quantity
    });
  };

  const handleBuyNow = () => {
    if (product.status === "out_of_stock") {
      alert("Sản phẩm hiện đã hết hàng!");
      return;
    }
    // Buy now logic here
    console.log("Buying now:", {
      product: product.name,
      sku: selectedSku?.sku_code,
      quantity
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <Image
                  src={product.images[0]?.image_url || "/placeholder.jpg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image) => (
                  <div key={image.id} className="relative aspect-square rounded-lg overflow-hidden cursor-pointer">
                    <Image
                      src={image.image_url}
                      alt={product.name}
                      fill
                      className="object-cover hover:opacity-75 transition-opacity"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <p className="text-gray-600 mb-4">{product.short_description}</p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`w-5 h-5 ${star <= 4 ? "text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">(128 đánh giá)</span>
                </div>
              </div>

              {selectedSku && (
                <>
                  <div className="border-t border-b py-4">
                    <div className="flex items-baseline gap-4">
                      <span className="text-3xl font-bold text-pink-600">
                        {selectedSku.promotion_price.toLocaleString()}đ
                      </span>
                      <span className="text-lg text-gray-500 line-through">
                        {selectedSku.price.toLocaleString()}đ
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      Còn lại: {selectedSku.quantity} sản phẩm
                    </div>
                    {product.status === "out_of_stock" && (
                      <div className="text-red-500 font-medium mt-2">
                        Sản phẩm tạm hết hàng
                      </div>
                    )}
                  </div>

                  {/* Variants */}
                  <div>
                    {selectedSku.variant_values.map((variantValue) => (
                      <div key={variantValue.id} className="mb-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-2">
                          {variantValue.variant.name}:
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                          {product.skus
                            .filter(
                              (sku) =>
                                sku.variant_values.some(
                                  (v) => v.variant_id === variantValue.variant_id
                                )
                            )
                            .map((sku) => {
                              const value = sku.variant_values.find(
                                (v) => v.variant_id === variantValue.variant_id
                              );
                              return (
                                <button
                                  key={sku.id}
                                  className={`border rounded-lg py-2 px-4 text-sm font-medium ${
                                    selectedSku.id === sku.id
                                      ? "border-pink-600 text-pink-600"
                                      : "border-gray-200 text-gray-900 hover:border-gray-300"
                                  }`}
                                  onClick={() => setSelectedSku(sku)}
                                >
                                  {value?.value}
                                </button>
                              );
                            })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quantity */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Số lượng:</h3>
                    <div className="flex items-center space-x-4">
                      <button
                        className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={product.status === "out_of_stock"}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={selectedSku.quantity}
                        value={quantity}
                        onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                        className="w-20 h-10 border border-gray-300 rounded-lg text-center"
                        disabled={product.status === "out_of_stock"}
                      />
                      <button
                        className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={product.status === "out_of_stock"}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      className={`w-full rounded-lg py-3 font-medium transition-colors ${
                        product.status === "out_of_stock"
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-pink-600 text-white hover:bg-pink-700"
                      }`}
                      onClick={handleAddToCart}
                      disabled={product.status === "out_of_stock"}
                    >
                      Thêm vào giỏ
                    </button>
                    <button
                      className={`w-full rounded-lg py-3 font-medium transition-colors ${
                        product.status === "out_of_stock"
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-gray-900 text-white hover:bg-gray-800"
                      }`}
                      onClick={handleBuyNow}
                      disabled={product.status === "out_of_stock"}
                    >
                      Mua ngay
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b">
            <nav className="flex">
              {["description", "specifications", "reviews"].map((tab) => (
                <button
                  key={tab}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === tab
                      ? "border-b-2 border-pink-600 text-pink-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "description" && "Mô tả"}
                  {tab === "specifications" && "Thông số"}
                  {tab === "reviews" && "Đánh giá"}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "description" && (
              <div className="prose max-w-none">
                <p>{product.description}</p>
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedSku?.variant_values.map((variantValue) => (
                  <div key={variantValue.id} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">{variantValue.variant.name}</h4>
                    <p>{variantValue.value}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b last:border-0 pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-4">
                        <div className="font-medium">{review.user}</div>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating ? "text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">{review.date}</div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}