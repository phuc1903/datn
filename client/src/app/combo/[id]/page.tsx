"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { StarIcon, HeartIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import { API_BASE_URL } from "@/config/config";

interface Sku {
  sku_code: string;
  product_id: number;
  image_url: string;
  pivot: {
    combo_id: number;
    sku_id: number;
  };
}

interface Combo {
  id: number;
  name: string;
  image_url: string;
  short_description: string;
  description: string;
  price: number;
  promotion_price: number;
  quantity: number;
  date_start: string;
  date_end: string;
  status: string;
  skus: Sku[];
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
  name: string;
  image_url: string;
  price: number;
  promotion_price: number;
}

interface CartItem {
  combo_id: number;
  name: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface Comment {
  id: number;
  combo_id: number;
  user_id: number;
  comment: string;
  parents_id: number | null;
  status: string;
  anonymous: string;
  created_at: string;
  updated_at: string;
  user?: {
    first_name: string;
    last_name: string;
  };
  replies?: Comment[];
  isOrphan?: boolean;
}

export default function ComboDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [combo, setCombo] = useState<Combo | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSkuIndex, setSelectedSkuIndex] = useState(0); // Để chọn SKU hiển thị hình ảnh
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  
  // Thêm state cho comments
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isReplyAnonymous, setIsReplyAnonymous] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());

  const token = Cookies.get("accessToken");

  useEffect(() => {
    if (!id) return;

    const fetchComboAndWishlist = async () => {
      setLoading(true);
      try {
        // Fetch combo details
        const comboResponse = await fetch(`${API_BASE_URL}/combos/detail/${id}`, {
          method: "GET",
        });
        if (!comboResponse.ok) throw new Error("Failed to fetch combo");
        const comboData = await comboResponse.json();
        if (comboData.status !== "success") throw new Error("Combo fetch failed");

        setCombo(comboData.data);

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

        // Fetch comments
        try {
          const commentsResponse = await fetch(`${API_BASE_URL}/combo_comments/getComboComment/${parseInt(id as string)}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
          });

          if (commentsResponse.ok) {
            const commentsData = await commentsResponse.json();
            const hierarchicalComments = processComments(commentsData.data);
            setComments(hierarchicalComments);
          } else {
            console.warn(`Không thể lấy bình luận: ${commentsResponse.status}`);
            setComments([]);
          }
        } catch (error) {
          console.error("Lỗi khi lấy bình luận:", error);
          setComments([]);
        }

      } catch (error) {
        console.error(error);
        toast.error("Không thể tải thông tin combo.");
        setCombo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchComboAndWishlist();
  }, [id, token]);

  // Hàm xử lý dữ liệu comment thành cấu trúc phân cấp
  const processComments = (comments: Comment[]): Comment[] => {
    const commentMap = new Map<number, Comment>();
    const rootComments: Comment[] = [];
    const orphanComments: Comment[] = [];

    // Tạo map cho tất cả comments
    comments.forEach(comment => {
      commentMap.set(comment.id, {
        ...comment,
        replies: []
      });
    });

    // Phân loại comments
    comments.forEach(comment => {
      const processedComment = commentMap.get(comment.id);
      if (!processedComment) return;

      if (comment.parents_id === null) {
        rootComments.push(processedComment);
      } else {
        const parentComment = commentMap.get(comment.parents_id);
        if (parentComment) {
          if (!parentComment.replies) {
            parentComment.replies = [];
          }
          parentComment.replies.push(processedComment);
        } else {
          orphanComments.push(processedComment);
        }
      }
    });

    // Thêm orphan comments vào cuối danh sách root
    orphanComments.forEach(comment => {
      rootComments.push({
        ...comment,
        isOrphan: true
      });
    });

    return rootComments;
  };

  // Hàm đếm tổng số replies
  const countTotalReplies = (comment: Comment): number => {
    let count = comment.replies?.length || 0;
    comment.replies?.forEach(reply => {
      count += countTotalReplies(reply);
    });
    return count;
  };

  // Hàm toggle hiển thị replies
  const toggleReplies = (commentId: number) => {
    const newExpandedComments = new Set(expandedComments);
    if (expandedComments.has(commentId)) {
      newExpandedComments.delete(commentId);
    } else {
      newExpandedComments.add(commentId);
    }
    setExpandedComments(newExpandedComments);
  };

  // Hàm gửi comment mới
  const handleSubmitComment = async (comment: string, parentId: number | null = null) => {
    if (!token) {
      toast.error("Vui lòng đăng nhập để bình luận!");
      router.push("/login");
      return;
    }

    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/combo_comments/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          combo_id: parseInt(id as string),
          comment: comment.trim(),
          parents_id: parentId,
          anonymous: parentId ? isReplyAnonymous : isAnonymous
        }),
      });

      if (!response.ok) {
        throw new Error("Không thể gửi bình luận");
      }

      // Refresh lại danh sách comment
      const commentsResponse = await fetch(`${API_BASE_URL}/combo_comments/getComboComment/${parseInt(id as string)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });

      if (commentsResponse.ok) {
        const commentsData = await commentsResponse.json();
        const hierarchicalComments = processComments(commentsData.data);
        setComments(hierarchicalComments);
      }

      // Reset form
      if (parentId) {
        setReplyText("");
        setReplyingTo(null);
      } else {
        setNewComment("");
      }

      toast.success("Đã gửi bình luận của bạn!");
    } catch (error) {
      console.error("Lỗi khi gửi bình luận:", error);
      toast.error("Không thể gửi bình luận. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hàm xóa comment
  const handleDeleteComment = async (commentId: number) => {
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/combo_comments/${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Không thể xóa bình luận");
      }

      // Refresh lại danh sách comment
      const commentsResponse = await fetch(`${API_BASE_URL}/combo_comments/getComboComment/${parseInt(id as string)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });

      if (commentsResponse.ok) {
        const commentsData = await commentsResponse.json();
        const hierarchicalComments = processComments(commentsData.data);
        setComments(hierarchicalComments);
      }

      toast.success("Đã xóa bình luận!");
    } catch (error) {
      console.error("Lỗi khi xóa bình luận:", error);
      toast.error("Không thể xóa bình luận. Vui lòng thử lại sau.");
    }
  };

  // Hàm render comment
  const renderComment = (comment: Comment, level: number = 0) => {
    const totalReplies = countTotalReplies(comment);
    const isExpanded = expandedComments.has(comment.id);
    const shouldShowReplies = totalReplies > 0;
    const visibleReplies = isExpanded ? comment.replies : (comment.replies || []);

    // Hiển thị tên người dùng
    const displayName = comment.anonymous === "enable" 
      ? "Người dùng ẩn danh"
      : `Người dùng ${comment.user_id}`;

    return (
      <div key={comment.id} className={`${level > 0 ? 'ml-4 mt-4' : 'border-b pb-4'}`}>
        {comment.isOrphan ? (
          <div className="text-gray-500 italic mb-2">
            Bình luận mà người dùng đang trả lời đã bị xóa
          </div>
        ) : null}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {comment.anonymous === "enable" ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-600 font-bold">?</span>
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                <span className="text-pink-600 font-bold">{comment.user_id}</span>
              </div>
            )}
            <div className="font-medium">
              {displayName}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              {new Date(comment.created_at).toLocaleDateString()}
            </div>
            {token && comment.user_id.toString() === Cookies.get("userId") && (
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="text-red-500 hover:text-red-700"
              >
                Xóa
              </button>
            )}
          </div>
        </div>
        <p className="text-gray-700 mb-2">{comment.comment}</p>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
            className="text-sm text-pink-600 hover:text-pink-700"
          >
            {replyingTo === comment.id ? "Hủy" : "Trả lời"}
          </button>
          {totalReplies > 0 && (
            <button
              onClick={() => toggleReplies(comment.id)}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              {isExpanded ? "Ẩn bớt" : `Xem ${totalReplies} phản hồi`}
            </button>
          )}
        </div>

        {replyingTo === comment.id && (
          <div className="mt-2 ml-4">
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`anonymous-reply-${comment.id}`}
                checked={isReplyAnonymous}
                onChange={(e) => setIsReplyAnonymous(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor={`anonymous-reply-${comment.id}`} className="text-sm text-gray-600">
                Bình luận ẩn danh
              </label>
            </div>
            <textarea
              rows={2}
              placeholder="Viết phản hồi..."
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <div className="flex justify-end space-x-2 mt-2">
              <button
                onClick={() => {
                  setReplyingTo(null);
                  setReplyText("");
                  setIsReplyAnonymous(false);
                }}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  if (replyText.trim()) {
                    handleSubmitComment(replyText, comment.id);
                  }
                }}
                disabled={isSubmitting || !replyText.trim()}
                className={`text-sm text-pink-600 hover:text-pink-700 ${
                  (isSubmitting || !replyText.trim()) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? "Đang gửi..." : "Gửi"}
              </button>
            </div>
          </div>
        )}

        {shouldShowReplies && visibleReplies && visibleReplies.length > 0 && (
          <div className={`space-y-4 mt-4 ${!isExpanded ? 'hidden' : ''}`}>
            {visibleReplies.map((reply) => renderComment(reply, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const reviews: Review[] = [
    {
      id: 1,
      user: "Nguyễn Thị A",
      rating: 5,
      comment: "Combo rất đáng tiền, sản phẩm chất lượng!",
      date: "2024-01-15",
    },
    {
      id: 2,
      user: "Trần Văn B",
      rating: 4,
      comment: "Gói combo tiện lợi, giá hợp lý.",
      date: "2024-01-10",
    },
  ];

  const handleQuantityChange = useCallback((value: number) => {
    if (!combo) return;
    const newQuantity = Math.max(1, Math.min(value, combo.quantity));
    setQuantity(newQuantity);
  }, [combo]);

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
    if (!combo) return;

    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = storedCart.find((item: CartItem) => item.combo_id === combo.id);
    let updatedCart;

    const cartItem = {
      combo_id: combo.id,
      name: combo.name,
      image_url: combo.image_url,
      price: combo.promotion_price > 0 ? combo.promotion_price : combo.price,
      quantity: quantity,
    };

    if (existingItem) {
      updatedCart = storedCart.map((item: CartItem) =>
        item.combo_id === combo.id
          ? { ...item, quantity: Math.min(item.quantity + quantity, combo.quantity) }
          : item
      );
    } else {
      updatedCart = [...storedCart, cartItem];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success("Đã thêm combo vào giỏ hàng!");
  }, [combo, quantity, token, router]);

  const toggleWishlist = useCallback(async () => {
    if (!token) {
      toast.error("Vui lòng đăng nhập để thêm vào danh sách yêu thích!");
      router.push("/login");
      return;
    }
    if (!combo) return;

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
        body: JSON.stringify({ product_id: parseInt(id as string) }), // Giả định combo dùng cùng API yêu thích với sản phẩm
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
  }, [id, token, isWishlisted, combo, router]);

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
  if (!combo) return <p className="text-center p-5">Không tìm thấy combo</p>;

  const getDisplayPrice = () => {
    return combo.promotion_price > 0 ? combo.promotion_price : combo.price;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 relative">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="relative aspect-square rounded-lg overflow-hidden transition-all duration-300">
                <Image
                  src={combo.skus[selectedSkuIndex]?.image_url || combo.image_url || "/placeholder.jpg"}
                  alt={combo.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {combo.skus.map((item: Sku) => (
                  <div
                    key={item.sku_code}
                    className={`relative cursor-pointer ${
                      selectedSkuIndex === combo.skus.indexOf(item)
                        ? "ring-2 ring-pink-500"
                        : "ring-1 ring-gray-200"
                    }`}
                    onClick={() => setSelectedSkuIndex(combo.skus.indexOf(item))}
                  >
                    <Image
                      src={item.image_url}
                      alt={`${combo.name} - ${item.sku_code}`}
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
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{combo.name}</h1>
                    <h3 className="text-base md:text-lg font-bold text-gray-500">
                      Mã combo: {combo.skus[0]?.sku_code}
                    </h3>
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
                <div className="text-2xl md:text-3xl font-bold text-pink-600 mb-2">
                  {getDisplayPrice().toLocaleString()}đ
                </div>
                {combo.promotion_price > 0 && (
                  <div className="text-lg text-gray-500 line-through mb-2">
                    {combo.price.toLocaleString()}đ
                  </div>
                )}
                <div className="text-sm text-gray-500">
                  Còn lại: {combo.quantity} combo
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  Thời gian khuyến mãi: {new Date(combo.date_start).toLocaleString("vi-VN")} -{" "}
                  {new Date(combo.date_end).toLocaleString("vi-VN")}
                </div>
              </div>

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
                    max={combo.quantity}
                    value={quantity}
                    onChange={(e) =>
                      handleQuantityChange(Math.min(parseInt(e.target.value) || 1, combo.quantity))
                    }
                    className="w-20 h-10 border border-gray-300 rounded-lg text-center text-pink-600"
                  />
                  <button
                    disabled={quantity >= combo.quantity}
                    className={`w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 ${
                      quantity >= combo.quantity ? "opacity-50 cursor-not-allowed" : ""
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
              {["description", "products", "reviews", "comments"].map((tab) => (
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
                  {tab === "products" && "Sản phẩm trong combo"}
                  {tab === "reviews" && "Đánh giá"}
                  {tab === "comments" && "Bình luận"}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "description" && (
              combo.description || combo.short_description ? (
                <div className="prose max-w-none text-black">
                  <div dangerouslySetInnerHTML={{ __html: combo.description }} />
                  <p>{combo.short_description}</p>
                </div>
              ) : (
                <p className="text-gray-500">Chưa có mô tả combo.</p>
              )
            )}

            {activeTab === "products" && (
              combo.skus.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
                    {combo.skus.map((item: Sku) => (
                      <div key={item.sku_code} className="bg-gray-50 p-4 rounded-lg flex items-center space-x-4">
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                          <Image
                            src={item.image_url}
                            alt={item.sku_code}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Mã SKU: {item.sku_code}</h4>
                          <p className="text-sm text-gray-600">ID sản phẩm: {item.product_id}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Chưa có sản phẩm trong combo.</p>
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
                    {reviews.map((item: Review) => (
                      <div key={item.id} className="border-b border-gray-200 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, index) => (
                                <StarIcon
                                  key={index}
                                  className={`h-5 w-5 ${
                                    index < item.rating ? "text-yellow-400" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="ml-2 text-sm text-gray-500">{item.user}</span>
                          </div>
                          <span className="text-sm text-gray-500">{item.date}</span>
                        </div>
                        <p className="mt-2 text-gray-700">{item.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Chưa có đánh giá nào.</p>
                )}
              </div>
            )}

            {activeTab === "comments" && (
              <div className="space-y-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="anonymous-comment"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="anonymous-comment" className="text-sm text-gray-600">
                      Bình luận ẩn danh
                    </label>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Viết bình luận của bạn..."
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button
                    onClick={() => handleSubmitComment(newComment)}
                    disabled={isSubmitting || !newComment.trim()}
                    className={`self-end px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 ${
                      (isSubmitting || !newComment.trim()) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? "Đang gửi..." : "Gửi bình luận"}
                  </button>
                </div>

                <div className="space-y-6">
                  {comments.map((comment) => renderComment(comment))}
                </div>
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