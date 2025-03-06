"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import Swal from "sweetalert2";
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingCart,
  LogOut,
  Pen,
  Heart,
  Gift,
  Lock,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  X,
  Trash2,
  Eye,
} from "lucide-react";
import Image from "next/image";

interface UserData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role?: string;
  address?: string;
}

interface Address {
  id: string;
  province: string;
  district: string;
  ward: string;
  specific: string;
  isDefault: boolean;
}

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  variants?: { name: string; value: string }[];
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: string;
  items: OrderItem[];
  shipping: number;
  totalAmount: number;
}

interface WishlistItem {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  image: string;
  inStock: boolean;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("tai-khoan");
  const router = useRouter();

  // Address state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [specific, setSpecific] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeStatus, setActiveStatus] = useState("tất cả");

  // Wishlist state
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    const fetchProfileAndWishlist = async () => {
      const token = Cookies.get("accessToken");
      const email = Cookies.get("userEmail");

      if (!token || !email) {
        console.warn("No token or email found, redirecting to login.");
        Cookies.remove("accessToken");
        Cookies.remove("userEmail");
        router.push("/login");
        return;
      }

      try {
        // Fetch user profile
        const profileResponse = await fetch("http://127.0.0.1:8000/api/v1/users", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept": "application/json",
          },
        });

        if (!profileResponse.ok) {
          if (profileResponse.status === 401) {
            Swal.fire({
              icon: "error",
              title: "Hết phiên đăng nhập",
              text: "Vui lòng đăng nhập lại.",
              confirmButtonColor: "#f472b6",
            }).then(() => {
              Cookies.remove("accessToken");
              Cookies.remove("userEmail");
              router.push("/login");
            });
          }
          return;
        }

        const profileResult = await profileResponse.json();
        const foundUser = profileResult.data.find((u: UserData) => u.email === email);

        if (!foundUser) {
          Swal.fire({
            icon: "error",
            title: "Không tìm thấy người dùng",
            text: "Thông tin người dùng không tồn tại.",
            confirmButtonColor: "#f472b6",
          }).then(() => {
            Cookies.remove("accessToken");
            Cookies.remove("userEmail");
            router.push("/login");
          });
          return;
        }

        setUser(foundUser);

        // Load addresses from localStorage
        const savedAddresses = localStorage.getItem("userAddresses");
        if (savedAddresses) {
          setAddresses(JSON.parse(savedAddresses));
        } else {
          if (foundUser.address) {
            const defaultAddress = {
              id: "1",
              province: "Unknown",
              district: "Unknown",
              ward: "Unknown",
              specific: foundUser.address,
              isDefault: true,
            };
            setAddresses([defaultAddress]);
            localStorage.setItem("userAddresses", JSON.stringify([defaultAddress]));
          }
        }

        // Load orders from localStorage
        const savedOrders = localStorage.getItem("orders");
        if (savedOrders) {
          setOrders(JSON.parse(savedOrders));
        }

        // Fetch wishlist items
        setWishlistLoading(true);
        const wishlistResponse = await fetch("http://127.0.0.1:8000/api/v1/users/favorites", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!wishlistResponse.ok) {
          throw new Error("Failed to fetch wishlist items");
        }

        const wishlistData = await wishlistResponse.json();
        const favorites = wishlistData.data.favorites;

        const detailedItems = await Promise.all(
          favorites.map(async (favorite: any) => {
            const productResponse = await fetch(
              `http://127.0.0.1:8000/api/v1/products/detail/${favorite.id}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (!productResponse.ok) {
              throw new Error(`Failed to fetch details for product ${favorite.id}`);
            }

            const productData = await productResponse.json();
            const product = productData.data;

            const firstSku = product.skus[0];

            return {
              id: favorite.id,
              name: favorite.name,
              brand: favorite.admin_id === 1 ? "Various" : "Unknown",
              price: firstSku.promotion_price > 0 ? firstSku.promotion_price : firstSku.price,
              originalPrice: firstSku.price,
              image: firstSku.image_url,
              inStock: favorite.status !== "out_of_stock",
            };
          })
        );

        setWishlistItems(detailedItems);
      } catch (error) {
        console.error("Error fetching profile or wishlist:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không thể tải thông tin hồ sơ hoặc danh sách yêu thích.",
          confirmButtonColor: "#f472b6",
        });
      } finally {
        setLoading(false);
        setWishlistLoading(false);
      }
    };

    fetchProfileAndWishlist();
  }, [router]);

  const handleLogout = async () => {
    const token = Cookies.get("accessToken");
    if (!token) return;

    try {
      await fetch("http://127.0.0.1:8000/api/v1/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept": "application/json",
        },
      });

      Cookies.remove("accessToken");
      Cookies.remove("userEmail");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Đăng xuất thất bại. Vui lòng thử lại.",
        confirmButtonColor: "#f472b6",
      });
    }
  };

  // Address functions
  const openAddressModal = (address: Address | null = null) => {
    setCurrentAddress(address);
    if (address) {
      setProvince(address.province);
      setDistrict(address.district);
      setWard(address.ward);
      setSpecific(address.specific);
      setIsDefault(address.isDefault);
    } else {
      setProvince("");
      setDistrict("");
      setWard("");
      setSpecific("");
      setIsDefault(false);
    }
    setShowAddressModal(true);
  };

  const closeAddressModal = () => {
    setShowAddressModal(false);
    setCurrentAddress(null);
    setProvince("");
    setDistrict("");
    setWard("");
    setSpecific("");
    setIsDefault(false);
  };

  const saveAddress = () => {
    if (!province.trim() || !district.trim() || !ward.trim() || !specific.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        text: "Vui lòng nhập đầy đủ tất cả các trường thông tin địa chỉ!",
        confirmButtonColor: "#f472b6",
      });
      return;
    }

    let updatedAddresses = [...addresses];

    if (isDefault) {
      updatedAddresses = updatedAddresses.map((addr) => ({
        ...addr,
        isDefault: false,
      }));
    }

    const newAddress = {
      id: currentAddress ? currentAddress.id : Date.now().toString(),
      province,
      district,
      ward,
      specific,
      isDefault: isDefault || addresses.length === 0,
    };

    if (currentAddress) {
      updatedAddresses = updatedAddresses.map((addr) =>
        addr.id === currentAddress.id ? newAddress : addr
      );
    } else {
      updatedAddresses.push(newAddress);
    }

    setAddresses(updatedAddresses);
    localStorage.setItem("userAddresses", JSON.stringify(updatedAddresses));
    closeAddressModal();
  };

  const deleteAddress = (id: string) => {
    Swal.fire({
      title: "Xác nhận",
      text: "Bạn có chắc chắn muốn xóa địa chỉ này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f472b6",
      cancelButtonColor: "#d1d5db",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedAddresses = addresses.filter((addr) => addr.id !== id);
        if (
          addresses.find((addr) => addr.id === id)?.isDefault &&
          updatedAddresses.length > 0
        ) {
          updatedAddresses[0].isDefault = true;
        }
        setAddresses(updatedAddresses);
        localStorage.setItem("userAddresses", JSON.stringify(updatedAddresses));
      }
    });
  };

  // Order functions
  const statusList = [
    "Tất cả",
    "Đang xác nhận",
    "Đang đóng gói",
    "Đang giao hàng",
    "Đã giao",
    "Đã hủy",
  ];

  const statusIcons = {
    "Đang xác nhận": <Package className="w-5 h-5 text-yellow-500" />,
    "Đang đóng gói": <Package className="w-5 h-5 text-blue-500" />,
    "Đang giao hàng": <Truck className="w-5 h-5 text-orange-500" />,
    "Đã giao": <CheckCircle className="w-5 h-5 text-green-500" />,
    "Đã hủy": <XCircle className="w-5 h-5 text-red-500" />,
  };

  const filteredOrders =
    activeStatus === "tất cả"
      ? orders
      : orders.filter((order) => order.status.toLowerCase() === activeStatus.toLowerCase());

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  const handleCancelOrder = (orderId: string) => {
    Swal.fire({
      title: "Xác nhận",
      text: "Bạn có chắc chắn muốn hủy đơn hàng? Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f472b6",
      cancelButtonColor: "#d1d5db",
      confirmButtonText: "Hủy đơn",
      cancelButtonText: "Không",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedOrders = orders.map((order) =>
          order.id === orderId ? { ...order, status: "Đã hủy" } : order
        );
        setOrders(updatedOrders);
        localStorage.setItem("orders", JSON.stringify(updatedOrders));
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Đơn hàng của bạn đã bị hủy.",
          confirmButtonColor: "#f472b6",
        });
      }
    });
  };

  // Wishlist functions
  const removeFromWishlist = async (id: number) => {
    Swal.fire({
      title: "Xác nhận",
      text: "Bạn có chắc muốn xóa sản phẩm này khỏi danh sách yêu thích?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#f472b6",
      cancelButtonColor: "#d1d5db",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const accessToken = Cookies.get("accessToken");

          if (!accessToken) {
            throw new Error("No access token found");
          }

          const response = await fetch("http://127.0.0.1:8000/api/v1/users/remove-favorite", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              product_id: id,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to remove item from wishlist");
          }

          setWishlistItems(wishlistItems.filter((item) => item.id !== id));
          showToast("Đã xóa sản phẩm khỏi danh sách yêu thích", "success");
        } catch (error) {
          console.error("Error removing from wishlist:", error);
          showToast("Không thể xóa sản phẩm. Vui lòng thử lại!", "error");
        }
      }
    });
  };

  const showToast = (message: string, icon: "success" | "error") => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon,
      title: message,
    });
  };

  const getRoleBadgeStyle = (role?: string) =>
    role === "admin"
      ? "bg-red-100 text-red-800 border border-red-200"
      : "bg-pink-100 text-pink-800 border border-pink-200";

  const getRoleText = (role?: string) => (role === "admin" ? "Quản trị viên" : "Thành viên");

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );

  if (!user)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <p className="text-xl text-gray-600">No user data available.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
                <span className="text-4xl text-gray-600">
                  {user.first_name[0]}
                  {user.last_name[0]}
                </span>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {`${user.first_name} ${user.last_name}`}
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeStyle(
                    user.role
                  )}`}
                >
                  {getRoleText(user.role)}
                </span>
              </div>
              <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2">
                <Mail className="w-4 h-4" />
                {user.email}
              </p>
            </div>

            <div className="flex gap-3">
              <Link
                href="/order"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Đơn hàng
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-lg">
          <div className="w-full md:w-64 p-4 border-b md:border-b-0 md:border-r">
            {[
              { id: "tai-khoan", label: "Tài khoản", icon: User },
              { id: "yeu-thich", label: "Yêu thích", icon: Heart },
              { id: "don-hang", label: "Đơn hàng", icon: ShoppingCart },
              { id: "dia-chi", label: "Sổ địa chỉ", icon: MapPin },
              { id: "voucher", label: "Voucher", icon: Gift },
              { id: "doi-mat-khau", label: "Đổi mật khẩu", icon: Lock },
              // { id: "dang-xuat", label: "Đăng xuất", icon: LogOut },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center py-3 px-4 text-sm font-medium rounded-lg mb-2 ${
                  activeTab === tab.id
                    ? "bg-pink-100 text-pink-600"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <tab.icon className="w-5 h-5 mr-3" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 p-6">
            {activeTab === "tai-khoan" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                      <User className="w-5 h-5" />
                    </span>
                    <input
                      type="text"
                      value={`${user.first_name} ${user.last_name}`}
                      readOnly
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                      <Mail className="w-5 h-5" />
                    </span>
                    <input
                      type="email"
                      value={user.email}
                      readOnly
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                      <Phone className="w-5 h-5" />
                    </span>
                    <input
                      type="tel"
                      value={user.phone_number}
                      readOnly
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                      <MapPin className="w-5 h-5" />
                    </span>
                    <input
                      type="text"
                      value={
                        addresses.find((a) => a.isDefault)
                          ? `${addresses.find((a) => a.isDefault)?.specific}, ${
                              addresses.find((a) => a.isDefault)?.ward
                            }, ${addresses.find((a) => a.isDefault)?.district}, ${
                              addresses.find((a) => a.isDefault)?.province
                            }`
                          : "Chưa cập nhật"
                      }
                      readOnly
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "yeu-thich" && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-pink-500">
                  Danh sách sản phẩm yêu thích
                </h2>
                {wishlistLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
                  </div>
                ) : wishlistItems.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center text-black">
                    <div className="flex justify-center mb-4">
                      <Heart className="text-gray-300" size={64} />
                    </div>
                    <h2 className="text-xl font-medium text-gray-700 mb-4">
                      Danh sách yêu thích của bạn đang trống
                    </h2>
                    <p className="text-gray-500 mb-6">
                      Hãy thêm các sản phẩm yêu thích để xem chúng tại đây
                    </p>
                    <Link
                      href="/shop"
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors"
                    >
                      Khám phá sản phẩm
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                    {wishlistItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow relative group text-black"
                      >
                        <div className="relative h-48 bg-gray-100">
                          <Image
                            src={item.image || "/api/placeholder/200/200"}
                            alt={item.name}
                            className="object-cover"
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                            aria-label="Xóa khỏi danh sách yêu thích"
                          >
                            <Trash2 size={18} className="text-gray-600" />
                          </button>
                          {!item.inStock && (
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                              <div className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium">
                                Hết hàng
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="text-xs text-gray-500 mb-1">{item.brand}</div>
                          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 h-12">
                            {item.name}
                          </h3>
                          <div className="flex items-baseline mb-3">
                            <span className="font-semibold text-gray-900">
                              {formatPrice(item.price)}
                            </span>
                            {item.originalPrice > item.price && (
                              <span className="ml-2 text-sm text-gray-500 line-through">
                                {formatPrice(item.originalPrice)}
                              </span>
                            )}
                          </div>
                          <Link
                            href={`/product/${item.id}`}
                            className="w-full py-2 px-4 rounded-md flex items-center justify-center transition-colors bg-pink-500 hover:bg-pink-600 text-white"
                          >
                            <Eye size={18} className="mr-2" />
                            Xem
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "don-hang" && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-pink-500">
                  Lịch Sử Đơn Hàng
                </h2>

                <div className="mb-6 flex flex-wrap gap-2">
                  {statusList.map((status) => (
                    <button
                      key={status}
                      onClick={() => setActiveStatus(status.toLowerCase())}
                      className={`px-3 py-2 rounded-lg text-sm ${
                        activeStatus === status.toLowerCase()
                          ? "bg-pink-600 text-white"
                          : "bg-white text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white text-black rounded-lg shadow p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          {statusIcons[order.status]}
                          <span className="font-medium text-gray-700">{order.status}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          Mã Đơn: {order.orderNumber}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between">
                            <div>
                              <span className="font-medium">{item.name}</span>
                              <div className="text-sm text-gray-600">
                                {item.variants && item.variants.length > 0
                                  ? item.variants
                                      .map((v) => `${v.name}: ${v.value}`)
                                      .join(", ")
                                  : "Không có biến thể"}
                              </div>
                              <span className="text-sm text-gray-500 ml-2">
                                x{item.quantity}
                              </span>
                            </div>
                            <span>{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center border-t pt-4 text-gray-700">
                        <span className="text-sm text-gray-500">{order.date}</span>
                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-600">Phí Vận Chuyển:</span>
                            <span className="font-medium">
                              {formatPrice(order.shipping || 30000)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-base font-semibold">
                            <span className="text-gray-700">Tổng Cộng:</span>
                            <span className="text-pink-600">
                              {formatPrice(order.totalAmount)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end gap-2">
                        {order.status !== "Đã hủy" && order.status !== "Đã giao" && (
                          <button
                            className="text-pink-600 hover:text-pink-800"
                            onClick={() => handleCancelOrder(order.id)}
                          >
                            Hủy Đơn
                          </button>
                        )}
                        <button className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700">
                          Chi Tiết Đơn Hàng
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredOrders.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    Không có đơn hàng nào trong trạng thái này
                  </div>
                )}
              </div>
            )}

            {activeTab === "dia-chi" && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-pink-500">
                  Sổ địa chỉ
                </h2>
                <div className="space-y-4 text-black">
                  {addresses.length > 0 ? (
                    addresses.map((address) => (
                      <div key={address.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="mb-1">
                              {address.specific}, {address.ward}, {address.district}, {address.province}
                            </p>
                            {address.isDefault && (
                              <span className="inline-block px-2 py-1 bg-pink-100 text-pink-600 text-xs rounded-full">
                                Mặc định
                              </span>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openAddressModal(address)}
                              className="text-blue-500 hover:text-blue-700 flex items-center"
                            >
                              <Pen className="w-4 h-4 mr-1" /> Sửa
                            </button>
                            {!address.isDefault && (
                              <button
                                onClick={() => deleteAddress(address.id)}
                                className="text-red-500 hover:text-red-700 flex items-center"
                              >
                                <X className="w-4 h-4 mr-1" /> Xóa
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">Chưa có địa chỉ nào được lưu</p>
                  )}
                  <button
                    onClick={() => openAddressModal()}
                    className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
                  >
                    + Thêm địa chỉ mới
                  </button>
                </div>
              </div>
            )}

            {activeTab === "voucher" && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-pink-500">
                  Danh sách Voucher
                </h2>
                <p>Chưa có voucher nào.</p>
              </div>
            )}

            {activeTab === "doi-mat-khau" && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-pink-500">
                  Đổi mật khẩu
                </h2>
                <Link
                  href="/change-password"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700"
                >
                  <Pen className="w-4 h-4 mr-2" />
                  Đổi mật khẩu
                </Link>
              </div>
            )}

            {activeTab === "dang-xuat" && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-pink-500">
                  Đăng xuất
                </h2>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-4 border-b flex justify-between items-center text-black">
              <h3 className="text-lg font-medium">
                {currentAddress ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}
              </h3>
              <button
                onClick={closeAddressModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tỉnh/Thành phố
                </label>
                <input
                  type="text"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-black"
                  placeholder="Nhập tỉnh/thành phố"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quận/Huyện
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-black"
                  placeholder="Nhập quận/huyện"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phường/Xã
                </label>
                <input
                  type="text"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-black"
                  placeholder="Nhập phường/xã"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ cụ thể
                </label>
                <input
                  type="text"
                  value={specific}
                  onChange={(e) => setSpecific(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-black"
                  placeholder="Nhập số nhà, tên đường..."
                />
              </div>
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Đặt làm địa chỉ mặc định
                  </span>
                </label>
              </div>
              <div className="flex justify-end gap-2 text-black">
                <button
                  onClick={closeAddressModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={saveAddress}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                >
                  {currentAddress ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}