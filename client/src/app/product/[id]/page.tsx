"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { StarIcon, HeartIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import { API_BASE_URL } from "@/config/config";

interface ProductVariant {
  id: number;
  variant: {
    name: string;
  };
  value: string;
}

interface Sku {
  id: number;
  name: string;
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

interface WishlistItem {
  id: number;
}

interface Category {
  id: number;
  name: string;
}

interface CartItem {
  product_id: number;
  name: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface Product {
  id: number;
  name: string;
  skus: Sku[];
  description: string;
  short_description: string;
  image_url: string;
  categories: Category[];
}

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSku, setSelectedSku] = useState<Sku | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: string }>({});
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [selectedSkuIndex, setSelectedSkuIndex] = useState(0);

  const token = Cookies.get("accessToken");

  useEffect(() => {
    if (!id) return;

    const fetchProductAndWishlist = async () => {
      setLoading(true);
      try {
        // Fetch product details
        const productResponse = await fetch(`http://127.0.0.1:8000/api/v1/products/detail/${id}`);
        if (!productResponse.ok) throw new Error("Failed to fetch product");
        const productData = await productResponse.json();
        if (productData.status !== "success") throw new Error("Product fetch failed");
        
        setProduct(productData.data);
        setSelectedSku(productData.data.skus[0]);

        // Fetch wishlist if authenticated
        if (token) {
          const wishlistResponse = await fetch(`${API_BASE_URL}/users/favorites`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!wishlistResponse.ok) throw new Error("Failed to fetch wishlist");
          const wishlistData = await wishlistResponse.json();
          
          const isInWishlist = wishlistData.data?.favorites?.some(
            (item: WishlistItem) => item.id === parseInt(id as string)
          );
          setIsWishlisted(isInWishlist);
        }
      } catch (error) {
        console.error(error);
        toast.error("Không thể tải thông tin sản phẩm.");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndWishlist();
  }, [id, token]);

  const reviews: Review[] = [
    {
      id: 1,
      user: "Nguyễn Thị A",
      rating: 5,
      comment: "Sản phẩm rất tốt, da mịn màng hơn sau 1 tuần sử dụng",
      date: "2024-01-15",
    },
    {
      id: 2,
      user: "Trần Văn B",
      rating: 4,
      comment: "Chất lượng tốt, đóng gói cẩn thận. Sẽ mua lại",
      date: "2024-01-10",
    },
  ];

  const handleQuantityChange = useCallback(
    (value: number) => {
      if (!selectedSku?.quantity) return;
      const newQuantity = Math.max(1, Math.min(value, selectedSku.quantity));
      setQuantity(newQuantity);
    },
    [selectedSku]
  );

  const handleVariantChange = useCallback(
    (variantName: string, value: string) => {
      const newSelectedVariants = { ...selectedVariants, [variantName]: value };
      setSelectedVariants(newSelectedVariants);

      const matchedSku = product?.skus.find((sku: Sku) =>
        sku.variant_values.every(
          (variant) =>
            newSelectedVariants[variant.variant.name] === variant.value ||
            !newSelectedVariants[variant.variant.name]
        )
      );
      if (matchedSku) {
        setSelectedSku(matchedSku);
      }
      setQuantity(1);
    },
    [selectedVariants, product?.skus]
  );

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Vui lòng đăng nhập để gửi đánh giá!");
      router.push("/login");
      return;
    }
    console.log({ rating, comment });
    toast.success("Đánh giá của bạn đã được gửi!");
    setRating(0);
    setComment("");
    setShowReviewForm(false);
  };

  const handleAddToCart = useCallback(() => {
    if (!token) {
      toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng!");
      router.push("/login");
      return;
    }
    if (!product || !selectedSku || !selectedSku.quantity) return;

    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = storedCart.find((item: CartItem) => item.product_id === product.id);
    let updatedCart;

    const cartItem = {
      product_id: product.id,
      name: product.name,
      image_url: product.image_url,
      price: selectedSku.promotion_price > 0 ? selectedSku.promotion_price : selectedSku.price,
      quantity: quantity,
    };

    if (existingItem) {
      updatedCart = storedCart.map((item: CartItem) =>
        item.product_id === product.id
          ? { ...item, quantity: Math.min(item.quantity + quantity, selectedSku.quantity) }
          : item
      );
    } else {
      updatedCart = [...storedCart, cartItem];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success("Đã thêm sản phẩm vào giỏ hàng!");
  }, [product, quantity, token, router, selectedSku]);

  const toggleWishlist = useCallback(async () => {
    if (!token) {
      toast.error("Vui lòng đăng nhập để thêm vào danh sách yêu thích!");
      router.push("/login");
      return;
    }
    if (!product) return;

    setWishlistLoading(true);
    const url = isWishlisted
      ? "http://127.0.0.1:8000/api/v1/users/remove-favorite"
      : "http://127.0.0.1:8000/api/v1/users/add-favorite";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: parseInt(id as string) }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update wishlist");

      setIsWishlisted(!isWishlisted);
      toast.success(isWishlisted ? "Đã xóa khỏi yêu thích!" : "Đã thêm vào yêu thích!");
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi cập nhật danh sách yêu thích.");
    } finally {
      setWishlistLoading(false);
    }
  }, [id, token, isWishlisted, product, router]);

  const handleBuyNow = () => {
    if (!token) {
      toast.error("Vui lòng đăng nhập để mua hàng!");
      router.push("/login");
      return;
    }
    toast.success("Chuyển đến trang thanh toán...");
    // router.push("/checkout");
  };

  if (loading) return <p className="text-center p-5">Đang tải...</p>;
  if (!product) return <p className="text-center p-5">Không tìm thấy sản phẩm</p>;

  const getDisplayPrice = (sku: Sku) => {
    return sku.promotion_price > 0 ? sku.promotion_price : sku.price;
  };

  const variantOptions: { [key: string]: Set<string> } = {};
  product?.skus.forEach((sku: Sku) => {
    sku.variant_values.forEach((variant) => {
      if (!variantOptions[variant.variant.name]) {
        variantOptions[variant.variant.name] = new Set();
      }
      variantOptions[variant.variant.name].add(variant.value);
    });
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 relative">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="relative aspect-square rounded-lg overflow-hidden transition-all duration-300">
                <Image
                  src={selectedSku?.image_url || "/placeholder.jpg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {product.skus.map((item: Sku) => (
                  <div
                    key={item.id}
                    className={`relative cursor-pointer ${
                      selectedSkuIndex === product.skus.indexOf(item)
                        ? "ring-2 ring-pink-500"
                        : "ring-1 ring-gray-200"
                    }`}
                    onClick={() => setSelectedSkuIndex(product.skus.indexOf(item))}
                  >
                    <Image
                      src={item.image_url}
                      alt={`${product.name} - ${item.name}`}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
              <div className="flex justify-between items-center">
  <div>
    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
    {product?.categories?.length > 0 && (
      <h3 className="text-base md:text-lg font-bold text-gray-500">
        Danh mục: {product.categories.map((category) => category.name).join(", ")}
        {selectedSku && ` - Mã sản phẩm: ${selectedSku.name}`}
      </h3>
    )}
  </div>
  <button
    onClick={toggleWishlist}
    disabled={wishlistLoading}
    className="p-2 rounded-full hover:bg-gray-100"
  >
    <HeartIcon
      className={`w-6 h-6 ${
        isWishlisted ? "text-red-500 fill-red-500" : "text-gray-500"
      }`}
    />
  </button>
</div>
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

              <div className="border-t border-b py-4">
                {selectedSku && (
                  <>
                    <div className="text-2xl md:text-3xl font-bold text-pink-600 mb-2">
                      {getDisplayPrice(selectedSku).toLocaleString()}đ
                    </div>
                    {selectedSku.promotion_price > 0 && (
                      <div className="text-lg text-gray-500 line-through mb-2">
                        {selectedSku.price.toLocaleString()}đ
                      </div>
                    )}
                    <div className="text-sm text-gray-500">
                      Còn lại: {selectedSku.quantity} sản phẩm
                    </div>
                  </>
                )}
              </div>

              {Object.entries(variantOptions).map(([variantName, values]) => (
                <div key={variantName}>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">{variantName}:</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {Array.from(values).map((value) => {
                      const isAvailable = product.skus.some(
                        (sku) =>
                          sku.variant_values.some(
                            (v) => v.value === value && v.variant.name === variantName
                          ) && sku.quantity > 0
                      );
                      return (
                        <button
                          key={value}
                          disabled={!isAvailable}
                          className={`border rounded-lg py-2 px-4 text-sm font-medium ${
                            selectedVariants[variantName] === value
                              ? "border-pink-600 text-pink-600"
                              : "border-gray-200 text-gray-900 hover:border-gray-300"
                          } ${!isAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
                          onClick={() => handleVariantChange(variantName, value)}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">Số lượng:</h3>
                <div className="flex items-center space-x-4">
                  <button
                    disabled={quantity <= 1}
                    className={`w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 ${
                      quantity <= 1 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => handleQuantityChange(quantity - 1)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={selectedSku?.quantity || 1}
                    value={quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1;
                      handleQuantityChange(value);
                    }}
                    className="w-20 h-10 border border-gray-300 rounded-lg text-center text-pink-600"
                  />
                  <button
                    disabled={!selectedSku?.quantity || quantity >= selectedSku.quantity}
                    className={`w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 ${
                      !selectedSku?.quantity || quantity >= selectedSku.quantity ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => handleQuantityChange(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 hidden md:grid">
                <button
                  onClick={handleAddToCart}
                  className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700"
                >
                  Thêm vào giỏ hàng
                </button>
                <button
                  onClick={handleBuyNow}
                  className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 font-semibold"
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-20 md:mb-8">
          <div className="border-b sticky top-0 bg-white z-10">
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
              product.description || product.short_description ? (
                <div className="prose max-w-none text-black">
                  <div dangerouslySetInnerHTML={{ __html: product.description }} />
                  <p>{product.short_description}</p>
                </div>
              ) : (
                <p className="text-gray-500">Chưa có mô tả sản phẩm.</p>
              )
            )}

            {activeTab === "specifications" && (
              selectedSku && selectedSku.variant_values && selectedSku.variant_values.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Thông số kỹ thuật:</h3>
                  <ul className="space-y-2">
                    {selectedSku.variant_values.map((variant, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        {variant.variant.name}: {variant.value}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            )}

            {activeTab === "reviews" && (
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
                                star <= rating ? "text-yellow-400" : "text-gray-300"
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

                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-b last:border-0 pb-6 last:pb-0 text-black"
                      >
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
                ) : (
                  <p className="text-gray-500">Chưa có đánh giá nào.</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 flex items-center justify-between md:hidden z-20">
          <button
            onClick={toggleWishlist}
            disabled={wishlistLoading}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <HeartIcon
              className={`w-6 h-6 ${
                isWishlisted ? "text-red-500 fill-red-500" : "text-gray-500"
              }`}
            />
          </button>
          <button
            onClick={handleAddToCart}
            className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 flex-1 mx-2"
          >
            Thêm vào giỏ
          </button>
          <button
            onClick={handleBuyNow}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 flex-1 font-semibold"
          >
            Mua ngay
          </button>
        </div>
      </div>
    </div>
  );
}