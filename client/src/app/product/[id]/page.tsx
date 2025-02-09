"use client";

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { StarIcon } from 'lucide-react'
import { useParams } from "next/navigation";

interface ProductVariant {
  id: number;
  variant: {
    name: string;
  };
  value: string;
}

interface Sku {
  id: number;
  sku_code: string;
  price: number;
  promotion_price: number;
  quantity: number;
  image_url: string;
  variant_values: ProductVariant[];
}

interface Review {
  id: number;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSku, setSelectedSku] = useState<Sku | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`http://127.0.0.1:8000/api/products/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            setProduct(data.data);
            setSelectedSku(data.data.skus[0]);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id]);

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

  const handleQuantityChange = (value: number) => {
    if (!selectedSku) return;
    const newQuantity = Math.max(1, Math.min(value, selectedSku.quantity));
    setQuantity(newQuantity);
  }

  const handleSkuChange = (sku: Sku) => {
    setSelectedSku(sku);
    setSelectedVariant(null);
    setQuantity(1);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ rating, comment });
    setRating(0);
    setComment('');
    setShowReviewForm(false);
  }

  if (loading) return <p className="text-center p-5">Đang tải...</p>;
  if (!product) return <p className="text-center p-5">Không tìm thấy sản phẩm</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <Image
                  src={selectedSku?.image_url || "/placeholder.jpg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {product.skus.map((sku) => (
                  <div 
                    key={sku.id} 
                    className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => handleSkuChange(sku)}
                  >
                    <Image
                      src={sku.image_url}
                      alt={sku.sku_code}
                      fill
                      className={`object-cover hover:opacity-75 transition-opacity ${
                        selectedSku?.id === sku.id ? 'border-2 border-pink-600' : ''
                      }`}
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
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`w-5 h-5 ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">(128 đánh giá)</span>
                </div>
              </div>

              <div className="border-t border-b py-4">
                {selectedSku && (
                  <>
                    <div className="text-3xl font-bold text-pink-600 mb-2">
                      {selectedSku.promotion_price.toLocaleString()}đ
                    </div>
                    <div className="text-lg text-gray-500 line-through mb-2">
                      {selectedSku.price.toLocaleString()}đ
                    </div>
                    <div className="text-sm text-gray-500">
                      Còn lại: {selectedSku.quantity} sản phẩm
                    </div>
                  </>
                )}
              </div>

              {/* SKUs */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">Mã SKU:</h3>
                <div className="grid grid-cols-3 gap-4">
                  {product.skus.map((sku) => (
                    <button
                      key={sku.id}
                      className={`border rounded-lg py-2 px-4 text-sm font-medium ${
                        selectedSku?.id === sku.id
                          ? 'border-pink-600 text-pink-600'
                          : 'border-gray-200 text-gray-900 hover:border-gray-300'
                      }`}
                      onClick={() => handleSkuChange(sku)}
                    >
                      {sku.sku_code}
                    </button>
                  ))}
                </div>
              </div>

              {/* Variants */}
              {selectedSku && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Phân loại:</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {selectedSku.variant_values.map((variant) => (
                      <button
                        key={variant.id}
                        className={`border rounded-lg py-2 px-4 text-sm font-medium ${
                          selectedVariant?.id === variant.id
                            ? 'border-pink-600 text-pink-600'
                            : 'border-gray-200 text-gray-900 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedVariant(variant)}
                      >
                        {variant.value}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">Số lượng:</h3>
                <div className="flex items-center space-x-4">
                  <button
                    className="w-10 h-10 rounded-lg border text-black border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    onClick={() => handleQuantityChange(quantity - 1)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={selectedSku?.quantity || 1}
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                    className="w-20 h-10 border border-gray-300 rounded-lg text-center text-pink-600"
                  />
                  <button
                    className="w-10 h-10 rounded-lg border border-gray-300 text-black flex items-center justify-center hover:bg-gray-50"
                    onClick={() => handleQuantityChange(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <div className="grid grid-cols-2 gap-4">
                <button className="w-full bg-pink-600 text-white rounded-lg py-3 font-medium hover:bg-pink-700 transition-colors">
                  Thêm vào giỏ
                </button>
                <button className="w-full bg-gray-900 text-white rounded-lg py-3 font-medium hover:bg-gray-800 transition-colors">
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="border-b">
            <nav className="flex">
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === tab
                      ? 'border-b-2 border-pink-600 text-pink-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'description' && 'Mô tả'}
                  {tab === 'specifications' && 'Thông số'}
                  {tab === 'reviews' && 'Đánh giá'}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'description' && (
              <div className="prose max-w-none text-black">
                <p>{product.description}</p>
                <p>{product.short_description}</p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
                  {selectedSku?.variant_values.map((variant) => (
                    <div key={variant.id} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">{variant.variant.name}</h4>
                      <p>{variant.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="flex justify-between items-center mb-6 text-black">
                  <h3 className="text-lg font-medium">Đánh giá từ khách hàng</h3>
                  <button
                    className="text-pink-600 hover:text-pink-700 font-medium"
                    onClick={() => setShowReviewForm(true)}
                  >
                    Viết đánh giá
                  </button>
                </div>

                {showReviewForm && (
                  <form onSubmit={handleSubmitReview} className="mb-8 bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-medium mb-4 text-black">Đánh giá của bạn</h4>
                    <div className="mb-4">
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                          >
                            <StarIcon
                              className={`w-6 h-6 ${
                                star <= rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-4">
                      <textarea
                        rows={4}
                        placeholder="Chia sẻ trải nghiệm của bạn..."
                        className="w-full border border-gray-300 rounded-lg p-3 text-black"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        onClick={() => setShowReviewForm(false)}
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                      >
                        Gửi đánh giá
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b last:border-0 pb-6 last:pb-0 text-black">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-4">
                          <div className="font-medium">{review.user}</div>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <StarIcon
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}