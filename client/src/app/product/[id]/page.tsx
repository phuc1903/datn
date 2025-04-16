"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { StarIcon, HeartIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { API_BASE_URL } from "@/config/config";
import Avatar from 'react-avatar';

interface ProductVariant {
  id: number;
  variant: { name: string };
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
  sku_id: number;
  user_id: number;
  order_id: number;
  rating: string;
  comment: string;
  status: string;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    email_verified_at: string | null;
    status: string;
    sex: string;
    google_id: string | null;
    created_at: string;
    updated_at: string;
  };
  sku: {
    id: number;
    sku_code: string;
    product_id: number;
    price: number;
    promotion_price: number;
    quantity: number;
    image_url: string;
    created_at: string;
    updated_at: string;
    variant_values: ProductVariant[];
  };
}

interface Comment {
  id: number;
  product_id: number;
  user_id: number;
  admin_id: number | null;
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

interface Product {
  id: number;
  name: string;
  description: string;
  short_description: string;
  skus: Sku[];
  categories: { name: string }[];
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
  const [cartLoading, setCartLoading] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isReplyAnonymous, setIsReplyAnonymous] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());

  const token = Cookies.get("accessToken");

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
          // Nếu không tìm thấy parent, thêm vào danh sách orphan
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

  // Hàm đếm tổng số replies (bao gồm cả replies của replies)
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

  // Hàm hiển thị comment và các replies của nó
  const renderComment = (comment: Comment, level: number = 0) => {
    const totalReplies = countTotalReplies(comment);
    const isExpanded = expandedComments.has(comment.id);
    const shouldShowReplies = totalReplies > 0;
    const visibleReplies = isExpanded ? comment.replies : (comment.replies || []);

    // Hàm xử lý hiển thị tên ẩn danh
    const getAnonymousName = (firstName: string, lastName: string) => {
      const firstChar = firstName.charAt(0);
      const lastChar = lastName.charAt(0);
      return `${firstChar}**** ${lastChar}*`;
    };

    // Lấy tên hiển thị
    const displayName = comment.anonymous === "enable" 
      ? getAnonymousName(comment.user?.first_name || '', comment.user?.last_name || '')
      : `${comment.user?.first_name} ${comment.user?.last_name}`;

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
              <Avatar 
                name={displayName}
                size="32"
                round={true}
                textSizeRatio={2}
                className="flex-shrink-0"
              />
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

  const refreshToken = async () => {
    const refreshToken = Cookies.get("refreshToken");
    if (!refreshToken) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        Cookies.set("accessToken", data.access_token, { expires: 7 });
        return data.access_token;
      }
      return null;
    } catch (error) {
      console.error("Lỗi khi làm mới token:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchProductAndWishlist = async () => {
      if (!id) {
        console.warn("No product ID provided");
        return;
      }
  
      setLoading(true);
      let currentToken = token;
  
      try {
        // Lấy thông tin sản phẩm
        const productResponse = await fetch(`${API_BASE_URL}/products/detail/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            ...(currentToken && { Authorization: `Bearer ${currentToken}` }),
          },
        });
  
        if (!productResponse.ok) {
          if (productResponse.status === 401) {
            const newToken = await refreshToken();
            if (newToken) {
              currentToken = newToken;
              const retryResponse = await fetch(`${API_BASE_URL}/products/detail/${id}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "Accept": "application/json",
                  Authorization: `Bearer ${newToken}`,
                },
              });
              if (!retryResponse.ok) throw new Error(`Lỗi lấy sản phẩm sau khi làm mới token: ${retryResponse.status}`);
              const retryResult = await retryResponse.json();
              setProduct(retryResult.data);
              setSelectedSku(retryResult.data.skus[0]);
            } else {
              throw new Error("Không thể làm mới token");
            }
          } else {
            throw new Error(`Lỗi lấy sản phẩm: ${productResponse.status} - ${productResponse.statusText}`);
          }
        } else {
          const result = await productResponse.json();
          setProduct(result.data);
          setSelectedSku(result.data.skus[0]);
        }
  
        // Lấy danh sách yêu thích (wishlist) nếu có token
        if (currentToken) {
          const wishlistResponse = await fetch(`${API_BASE_URL}/users/favorites`, {
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              Authorization: `Bearer ${currentToken}`,
            },
          });
  
          if (!wishlistResponse.ok) {
            if (wishlistResponse.status === 401) {
              const newToken = await refreshToken();
              if (newToken) {
                currentToken = newToken;
                const retryWishlistResponse = await fetch(`${API_BASE_URL}/users/favorites`, {
                  headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    Authorization: `Bearer ${newToken}`,
                  },
                });
                if (!retryWishlistResponse.ok)
                  throw new Error(`Lỗi lấy danh sách yêu thích sau khi làm mới token: ${retryWishlistResponse.status}`);
                const retryWishlistData = await retryWishlistResponse.json();
                const isInWishlist = retryWishlistData.data?.favorites?.some(
                  (item: { id: number }) => item.id === parseInt(id as string)
                );
                setIsWishlisted(isInWishlist);
              } else {
                Swal.fire({
                  icon: "warning",
                  title: "Phiên đăng nhập hết hạn!",
                  text: "Vui lòng đăng nhập lại.",
                  confirmButtonText: "Đăng nhập",
                }).then(() => {
                  Cookies.remove("accessToken");
                  Cookies.remove("refreshToken");
                  router.push("/login");
                });
                return;
              }
            } else {
              throw new Error(`Lỗi lấy danh sách yêu thích: ${wishlistResponse.status}`);
            }
          } else {
            const wishlistData = await wishlistResponse.json();
            const isInWishlist = wishlistData.data?.favorites?.some(
              (item: { id: number }) => item.id === parseInt(id as string)
            );
            setIsWishlisted(isInWishlist);
          }
        }
  
        // Lấy đánh giá sản phẩm (tách biệt để không ảnh hưởng đến việc hiển thị sản phẩm)
        try {
          const reviewsResponse = await fetch(`${API_BASE_URL}/products/feedback-product/${id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              ...(currentToken && { Authorization: `Bearer ${currentToken}` }),
            },
          });
  
          if (reviewsResponse.ok) {
            const reviewsData = await reviewsResponse.json();
            setReviews(reviewsData.data || []); // Nếu không có đánh giá, gán mảng rỗng
          } else {
            console.warn(`Không thể lấy đánh giá: ${reviewsResponse.status}`);
            setReviews([]); // Nếu lỗi, gán mảng rỗng để không ảnh hưởng đến giao diện
          }
        } catch (error) {
          console.error("Lỗi khi lấy đánh giá:", error);
          setReviews([]); // Nếu có lỗi, gán mảng rỗng
        }
  
        // Lấy danh sách comment
        try {
          const commentsResponse = await fetch(`${API_BASE_URL}/product_comments/getProductComment/${parseInt(id as string)}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
          });

          if (commentsResponse.ok) {
            const commentsData = await commentsResponse.json();
            // Không cần chuyển đổi dữ liệu user nữa vì API đã trả về đầy đủ thông tin
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
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: "Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.",
        });
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProductAndWishlist();
  }, [id, token, router]);

  const handleQuantityChange = useCallback(
    (value: number) => {
      if (!selectedSku || selectedSku.quantity === undefined) return;
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
      if (matchedSku) setSelectedSku(matchedSku);
      setQuantity(1);
    },
    [selectedVariants, product?.skus]
  );

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Bạn cần đăng nhập!",
        text: "Vui lòng đăng nhập để gửi đánh giá.",
        confirmButtonText: "Đăng nhập",
      }).then(() => router.push("/login"));
      return;
    }
    console.log("Submitting review:", { rating, comment });
    Swal.fire({
      icon: "success",
      title: "Thành công!",
      text: "Đánh giá của bạn đã được gửi!",
      timer: 1500,
      showConfirmButton: false,
    });
    setRating(0);
    setComment("");
    setShowReviewForm(false);
  };

  const handleAddToCart = useCallback(async () => {
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Bạn cần đăng nhập!",
        text: "Vui lòng đăng nhập để thêm vào giỏ hàng.",
        confirmButtonText: "Đăng nhập",
      }).then(() => router.push("/login"));
      return;
    }
    if (!selectedSku || !product || !id) return;

    setCartLoading(true);
    let currentToken = token;
    const cartItem = { product_id: parseInt(id as string), sku_id: selectedSku.id, quantity };

    try {
      const response = await fetch(`${API_BASE_URL}/carts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify(cartItem),
      });

      if (!response.ok) {
        if (response.status === 401) {
          const newToken = await refreshToken();
          if (newToken) {
            currentToken = newToken;
            const retryResponse = await fetch(`${API_BASE_URL}/carts`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                Authorization: `Bearer ${newToken}`,
              },
              body: JSON.stringify(cartItem),
            });
            if (!retryResponse.ok) throw new Error(`Lỗi thêm vào giỏ hàng sau khi làm mới token: ${retryResponse.status}`);
          } else {
            Swal.fire({
              icon: "warning",
              title: "Phiên đăng nhập hết hạn!",
              text: "Vui lòng đăng nhập lại.",
              confirmButtonText: "Đăng nhập",
            }).then(() => {
              Cookies.remove("accessToken");
              Cookies.remove("refreshToken");
              router.push("/login");
            });
            return;
          }
        } else {
          throw new Error(`Lỗi thêm vào giỏ hàng: ${response.status}`);
        }
      }

      Swal.fire({
        icon: "success",
        title: "Đã thêm vào giỏ hàng!",
        text: "Bạn muốn làm gì tiếp theo?",
        showCancelButton: true,
        confirmButtonText: "Đi đến giỏ hàng",
        cancelButtonText: "Tiếp tục mua sắm",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
      }).then((result) => {
        if (result.isConfirmed) router.push("/cart");
      });
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Không thể thêm vào giỏ hàng.",
      });
    } finally {
      setCartLoading(false);
    }
  }, [selectedSku, product, quantity, token, router, id]);

  const toggleWishlist = useCallback(async () => {
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Bạn cần đăng nhập!",
        text: "Vui lòng đăng nhập để thêm vào danh sách yêu thích.",
        confirmButtonText: "Đăng nhập",
      }).then(() => router.push("/login"));
      return;
    }
    if (!product || !id) return;

    setWishlistLoading(true);
    let currentToken = token;
    const url = isWishlisted ? `${API_BASE_URL}/users/remove-favorite` : `${API_BASE_URL}/users/add-favorite`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify({ product_id: parseInt(id as string) }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          const newToken = await refreshToken();
          if (newToken) {
            currentToken = newToken;
            const retryResponse = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                Authorization: `Bearer ${newToken}`,
              },
              body: JSON.stringify({ product_id: parseInt(id as string) }),
            });
            if (!retryResponse.ok)
              throw new Error(`Lỗi cập nhật danh sách yêu thích sau khi làm mới token: ${retryResponse.status}`);
          } else {
            Swal.fire({
              icon: "warning",
              title: "Phiên đăng nhập hết hạn!",
              text: "Vui lòng đăng nhập lại.",
              confirmButtonText: "Đăng nhập",
            }).then(() => {
              Cookies.remove("accessToken");
              Cookies.remove("refreshToken");
              router.push("/login");
            });
            return;
          }
        } else {
          throw new Error(`Lỗi cập nhật danh sách yêu thích: ${response.status}`);
        }
      }

      setIsWishlisted(!isWishlisted);
      Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: isWishlisted ? "Đã xóa khỏi yêu thích!" : "Đã thêm vào yêu thích!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật danh sách yêu thích:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Có lỗi xảy ra khi cập nhật danh sách yêu thích.",
      });
    } finally {
      setWishlistLoading(false);
    }
  }, [id, token, isWishlisted, product, router]);

  const handleBuyNow = async () => {
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Bạn cần đăng nhập!",
        text: "Vui lòng đăng nhập để mua hàng.",
        confirmButtonText: "Đăng nhập",
      }).then(() => router.push("/login"));
      return;
    }
    Swal.fire({
      icon: "success",
      title: "Đang xử lý!",
      text: "Chuyển đến trang thanh toán...",
      timer: 1500,
      showConfirmButton: false,
    });
    router.push("/checkout");
  };

  // Hàm gửi comment mới
  const handleSubmitComment = async (comment: string, parentId: number | null = null) => {
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Bạn cần đăng nhập!",
        text: "Vui lòng đăng nhập để bình luận.",
        confirmButtonText: "Đăng nhập",
      }).then(() => router.push("/login"));
      return;
    }

    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/product_comments/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: parseInt(id as string),
          comment: comment.trim(),
          parents_id: parentId,
          anonymous: parentId ? isReplyAnonymous : isAnonymous
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          const newToken = await refreshToken();
          if (newToken) {
            // Thử lại với token mới
            const retryResponse = await fetch(`${API_BASE_URL}/product_comments/create`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${newToken}`,
              },
              body: JSON.stringify({
                product_id: parseInt(id as string),
                comment: comment.trim(),
                parents_id: parentId,
                anonymous: parentId ? isReplyAnonymous : isAnonymous
              }),
            });
            if (!retryResponse.ok) {
              throw new Error("Không thể gửi bình luận");
            }
          } else {
            Swal.fire({
              icon: "warning",
              title: "Phiên đăng nhập hết hạn!",
              text: "Vui lòng đăng nhập lại.",
              confirmButtonText: "Đăng nhập",
            }).then(() => {
              Cookies.remove("accessToken");
              Cookies.remove("refreshToken");
              router.push("/login");
            });
            return;
          }
        } else {
          throw new Error("Không thể gửi bình luận");
        }
      }

      // Refresh lại danh sách comment
      const commentsResponse = await fetch(`${API_BASE_URL}/product_comments/getProductComment/${parseInt(id as string)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });

      if (commentsResponse.ok) {
        const commentsData = await commentsResponse.json();
        // Không cần chuyển đổi dữ liệu user nữa vì API đã trả về đầy đủ thông tin
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

      Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: "Đã gửi bình luận của bạn.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Lỗi khi gửi bình luận:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Không thể gửi bình luận. Vui lòng thử lại sau.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hàm xóa comment
  const handleDeleteComment = async (commentId: number) => {
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/product_comments/${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          const newToken = await refreshToken();
          if (newToken) {
            const retryResponse = await fetch(`${API_BASE_URL}/product_comments/${commentId}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${newToken}`,
              },
            });
            if (!retryResponse.ok) throw new Error("Không thể xóa bình luận");
          } else {
            throw new Error("Token hết hạn");
          }
        } else {
          throw new Error("Không thể xóa bình luận");
        }
      }

      // Refresh lại danh sách comment
      const commentsResponse = await fetch(`${API_BASE_URL}/product_comments/getProductComment/${parseInt(id as string)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });

      if (commentsResponse.ok) {
        const commentsData = await commentsResponse.json();
        const processedComments = commentsData.data.map((comment: Comment) => ({
          ...comment,
          user: {
            first_name: "Người dùng",
            last_name: comment.user_id.toString()
          }
        }));
        const hierarchicalComments = processComments(processedComments);
        setComments(hierarchicalComments);
      }

      Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: "Đã xóa bình luận.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Lỗi khi xóa bình luận:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Không thể xóa bình luận. Vui lòng thử lại sau.",
      });
    }
  };

  if (loading) return <p className="text-center p-5">Đang tải...</p>;
  if (!product) return <p className="text-center p-5">Không tìm thấy sản phẩm</p>;

  const getDisplayPrice = (sku: Sku) => (sku.promotion_price > 0 ? sku.promotion_price : sku.price);

  const variantOptions: { [key: string]: Set<string> } = {};
  product?.skus.forEach((sku: Sku) => {
    sku.variant_values.forEach((variant) => {
      if (!variantOptions[variant.variant.name]) variantOptions[variant.variant.name] = new Set();
      variantOptions[variant.variant.name].add(variant.value);
    });
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 relative">
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
                {product.skus.map((sku: Sku) => (
                  <div
                    key={sku.id}
                    className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => setSelectedSku(sku)}
                  >
                    <Image
                      src={sku.image_url}
                      alt={sku.sku_code}
                      fill
                      className={`object-cover hover:opacity-75 transition-opacity ${selectedSku?.id === sku.id ? "border-2 border-pink-600" : ""
                        }`}
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
                        Danh mục: {product.categories.map((category: any) => category.name).join(", ")}
                        {selectedSku && ` - Mã sản phẩm: ${selectedSku.sku_code}`}
                      </h3>
                    )}
                  </div>
                  <button
                    onClick={toggleWishlist}
                    disabled={wishlistLoading}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <HeartIcon
                      className={`w-6 h-6 ${isWishlisted ? "text-red-500 fill-red-500" : "text-gray-500"}`}
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
                  <span className="text-gray-600">({reviews.length} đánh giá)</span>
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
                    <div className="text-sm text-gray-500">Còn lại: {selectedSku.quantity} sản phẩm</div>
                  </>
                )}
              </div>

              {Object.entries(variantOptions).map(([variantName, values]) => (
                <div key={variantName}>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">{variantName}:</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {Array.from(values).map((value) => {
                      const isAvailable = product.skus.some(
                        (sku: Sku) =>
                          sku.variant_values.some(
                            (v) => v.value === value && v.variant.name === variantName
                          ) && sku.quantity > 0
                      );
                      return (
                        <button
                          key={value}
                          disabled={!isAvailable}
                          className={`border rounded-lg py-2 px-4 text-sm font-medium ${selectedVariants[variantName] === value
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
                    className={`w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 ${quantity <= 1 ? "opacity-50 cursor-not-allowed" : ""
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
                    onChange={(e) =>
                      handleQuantityChange(Math.min(parseInt(e.target.value) || 1, selectedSku?.quantity || 1))
                    }
                    className="w-20 h-10 border border-gray-300 rounded-lg text-center text-pink-600"
                  />
                  <button
                    disabled={selectedSku ? quantity >= selectedSku.quantity : true}
                    className={`w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 ${selectedSku && quantity >= selectedSku.quantity ? "opacity-50 cursor-not-allowed" : ""
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
                  disabled={cartLoading}
                  className={`bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 ${cartLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                  {cartLoading ? "Đang thêm..." : "Thêm vào giỏ hàng"}
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
              {["description", "specifications", "reviews", "comments"].map((tab) => (
                <button
                  key={tab}
                  className={`px-6 py-4 text-sm font-medium ${activeTab === tab
                      ? "border-b-2 border-pink-600 text-pink-600"
                      : "text-gray-500 hover:text-gray-700"
                    }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "description" && "Mô tả"}
                  {tab === "specifications" && "Thông số"}
                  {tab === "reviews" && "Đánh giá"}
                  {tab === "comments" && "Bình luận"}
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
              selectedSku && selectedSku.variant_values && selectedSku.variant_values.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
                    {selectedSku.variant_values.map((variant: ProductVariant) => (
                      <div key={variant.id} className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">{variant.variant.name}</h4>
                        <p>{variant.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Chưa có thông số sản phẩm.</p>
              )
            )}

            {activeTab === "reviews" && (
              <div>
                <div className="flex justify-between items-center mb-8 text-black">
                  <h3 className="text-lg font-medium">Đánh giá từ khách hàng</h3>
                  <button
                    className="text-pink-600 hover:text-pink-700 font-medium transition-colors duration-300"
                    onClick={() => setShowReviewForm(true)}
                  >
                    Viết đánh giá
                  </button>
                </div>

                {showReviewForm && (
                  <form onSubmit={handleSubmitReview} className="mb-8 bg-gray-50 p-6 rounded-lg shadow-md">
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
                              className={`w-6 h-6 transition-colors duration-200 ${star <= rating ? "text-yellow-400" : "text-gray-300"
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
                        className="w-full border border-gray-300 rounded-lg p-3 text-black focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all duration-300"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-300"
                        onClick={() => setShowReviewForm(false)}
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-all duration-300"
                      >
                        Gửi đánh giá
                      </button>
                    </div>
                  </form>
                )}

                {reviews.length > 0 ? (
                  <div className="space-y-8">
                    {reviews.map((review) => {
                      const sku = review.sku || {};
                      const variantValues = sku.variant_values || [];

                      const variantOptionsForSku: { [key: string]: string[] } = {};
                      variantValues.forEach((variant: ProductVariant) => {
                        const variantName = variant.variant.name;
                        if (!variantOptionsForSku[variantName]) {
                          variantOptionsForSku[variantName] = [];
                        }
                        variantOptionsForSku[variantName].push(variant.value);
                      });

                      // Lấy ảnh từ sku.image_url, nếu không có thì dùng placeholder
                      const reviewImages = sku.image_url ? [sku.image_url] : [];

                      return (
                        <div
                          key={review.id}
                          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <div className="font-medium text-black hover:text-pink-600 transition-colors duration-300">{`${review.user.first_name} ${review.user.last_name}`}</div>
                              <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <StarIcon
                                    key={star}
                                    className={`w-4 h-4 transition-colors duration-200 ${star <= parseInt(review.rating) ? "text-yellow-400" : "text-gray-300"
                                      }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(review.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          <p className="text-black mb-3">{review.comment}</p>
                          <div className="text-sm text-gray-500 space-y-1 mb-4">
                            {Object.keys(variantOptionsForSku).length > 0 ? (
                              <div>
                                <ul className="list-none">
                                  {Object.entries(variantOptionsForSku).map(([variantName, values]) => (
                                    <li key={variantName}>
                                      {variantName}: {values.join(", ")}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ) : (
                              <p>Không có thông tin biến thể</p>
                            )}
                          </div>
                          {/* Hiển thị ảnh từ sku.image_url */}
                          {reviewImages.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {reviewImages.map((image, index) => (
                                <div
                                  key={index}
                                  className="relative aspect-square rounded-md overflow-hidden border border-gray-200 transform transition-all duration-300 hover:scale-105 hover:shadow-md"
                                >
                                  <Image
                                    src={image}
                                    alt={`Review image ${index + 1}`}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm">Không có ảnh minh họa.</p>
                          )}
                        </div>
                      );
                    })}
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
              className={`w-6 h-6 ${isWishlisted ? "text-red-500 fill-red-500" : "text-gray-500"}`}
            />
          </button>
          <button
            onClick={handleAddToCart}
            disabled={cartLoading}
            className={`bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 flex-1 mx-2 ${cartLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {cartLoading ? "Đang thêm..." : "Thêm vào giỏ"}
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