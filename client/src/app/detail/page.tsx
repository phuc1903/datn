"use client";
// pages/products/[id].tsx
import Image from 'next/image'
import { useState } from 'react'
import { StarIcon } from 'lucide-react'

interface ProductVariant {
  id: number
  size: string
  price: number
  stock: number
}

interface Review {
  id: number
  user: string
  rating: number
  comment: string
  date: string
}

export default function ProductDetail() {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>({
    id: 1,
    size: '50ml',
    price: 899000,
    stock: 10
  })
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [showReviewForm, setShowReviewForm] = useState(false)

  const variants: ProductVariant[] = [
    { id: 1, size: '50ml', price: 899000, stock: 10 },
    { id: 2, size: '100ml', price: 1599000, stock: 5 },
    { id: 3, size: '150ml', price: 2299000, stock: 3 }
  ]

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
  ]

  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(1, Math.min(value, selectedVariant.stock))
    setQuantity(newQuantity)
  }

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle review submission
    console.log({ rating, comment })
    setRating(0)
    setComment('')
    setShowReviewForm(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Product Overview Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <Image
                  src="/oxy.jpg"
                  alt="Product Image"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((img) => (
                  <div key={img} className="relative aspect-square rounded-lg overflow-hidden cursor-pointer">
                    <Image
                      src={`/oxy.jpg`}
                      alt={`Product Image ${img}`}
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
                  Kem Dưỡng Ẩm Chống Lão Hóa Premium
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
                <div className="text-3xl font-bold text-pink-600 mb-2">
                  {selectedVariant.price.toLocaleString()}đ
                </div>
                <div className="text-sm text-gray-500">
                  Còn lại: {selectedVariant.stock} sản phẩm
                </div>
              </div>

              {/* Variants */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">Dung tích:</h3>
                <div className="grid grid-cols-3 gap-4">
                  {variants.map((variant) => (
                    <button
                      key={variant.id}
                      className={`border rounded-lg py-2 px-4 text-sm font-medium ${
                        selectedVariant.id === variant.id
                          ? 'border-pink-600 text-pink-600'
                          : 'border-gray-200 text-gray-900 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedVariant(variant)}
                    >
                      {variant.size}
                    </button>
                  ))}
                </div>
              </div>

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
                    max={selectedVariant.stock}
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
                <p>
                  Kem dưỡng ẩm chống lão hóa Premium được nghiên cứu và phát triển với công nghệ tiên tiến,
                  giúp nuôi dưỡng làn da từ sâu bên trong. Sản phẩm chứa các thành phần dưỡng ẩm cao cấp
                  và các peptide chống lão hóa hiệu quả.
                </p>
                <h3>Công dụng chính:</h3>
                <ul>
                  <li>Dưỡng ẩm chuyên sâu, giữ ẩm lâu dài</li>
                  <li>Làm mềm mịn và săn chắc da</li>
                  <li>Giảm thiểu nếp nhăn và dấu hiệu lão hóa</li>
                  <li>Cải thiện tông màu da</li>
                </ul>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Thành phần chính</h4>
                    <p>Hyaluronic Acid, Peptide Complex, Vitamin E</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Xuất xứ</h4>
                    <p>Hàn Quốc</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Hạn sử dụng</h4>
                    <p>36 tháng kể từ ngày sản xuất</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Phù hợp với</h4>
                    <p>Mọi loại da</p>
                  </div>
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
                                  star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}