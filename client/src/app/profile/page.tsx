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
  Heart,
  Gift,
  Lock,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
} from "lucide-react";
import Image from "next/image";

// Types
interface UserData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role?: string;
}

interface Address {
  id: number;
  name: string;
  phone_number: string;
  address: string;
  province_code: string;
  district_code: string;
  ward_code: string;
  default: string;
  province: { full_name: string };
  district: { full_name: string };
  ward: { total_name: string };
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  date: string;
  totalAmount: number;
  items: {
    product: {
      name: string;
      price: number;
    };
    quantity: number;
  }[];
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

interface Voucher {
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
  pivot?: {
    user_id: number;
    voucher_id: number;
  };
}

// Utility Functions
const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

// Components
const UserInfo = ({ user, addresses }: { user: UserData; addresses: Address[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
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
      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
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
      <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
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
      <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
          <MapPin className="w-5 h-5" />
        </span>
        <input
          type="text"
          value={
            addresses.find((a) => a.default === "default")
              ? `${addresses.find((a) => a.default === "default")?.address || ""}, ${
                  addresses.find((a) => a.default === "default")?.ward?.total_name || ""
                }, ${addresses.find((a) => a.default === "default")?.district?.full_name || ""}, ${
                  addresses.find((a) => a.default === "default")?.province?.full_name || ""
                }`
              : "Chưa cập nhật"
          }
          readOnly
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
        />
      </div>
    </div>
  </div>
);

const Wishlist = ({ items, onRemove }: { items: WishlistItem[]; onRemove: (id: number) => void }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4 text-pink-500">Danh sách sản phẩm yêu thích</h2>
    {items.length === 0 ? (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center text-black">
        <Heart className="text-gray-300 mx-auto mb-4" size={64} />
        <h2 className="text-xl font-medium text-gray-700 mb-4">Danh sách yêu thích trống</h2>
        <Link href="/shop" className="inline-flex items-center px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-md">
          Khám phá sản phẩm
        </Link>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow relative text-black">
            <div className="relative h-48 bg-gray-100">
              <Image src={item.image} alt={item.name} className="object-cover" fill sizes="(max-width: 768px) 100vw, 33vw" />
              <button
                onClick={() => onRemove(item.id)}
                className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
              >
                <Trash2 size={18} className="text-gray-600" />
              </button>
              {!item.inStock && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <div className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm">Hết hàng</div>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="text-xs text-gray-500 mb-1">{item.brand}</div>
              <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 h-12">{item.name}</h3>
              <div className="flex items-baseline mb-3">
                <span className="font-semibold text-gray-900">{formatPrice(item.price)}</span>
                {item.originalPrice > item.price && (
                  <span className="ml-2 text-sm text-gray-500 line-through">{formatPrice(item.originalPrice)}</span>
                )}
              </div>
              <Link href={`/product/${item.id}`} className="w-full py-2 px-4 rounded-md flex items-center justify-center bg-pink-500 hover:bg-pink-600 text-white">
                <Eye size={18} className="mr-2" /> Xem
              </Link>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const Orders = ({ orders, onCancel }: { orders: Order[]; onCancel: (id: string) => void }) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const statusMap: { [key: string]: string } = {
    waiting: "Chờ thanh toán",
    pending: "Cửa hàng đang xử lý",
    shipped: "Đã giao hàng",
    success: "Giao hàng thành công",
    cancel: "Đã hủy",
  };

  const statusIcons: Record<string, JSX.Element> = {
    waiting: <Package className="w-5 h-5 text-yellow-500" />,
    pending: <Package className="w-5 h-5 text-blue-500" />,
    shipped: <Truck className="w-5 h-5 text-orange-500" />,
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    cancel: <XCircle className="w-5 h-5 text-red-500" />,
  };

  const statusFilters = [
    { label: "Tất cả", value: "all" },
    { label: "Chờ thanh toán", value: "waiting" },
    { label: "Cửa hàng đang xử lý", value: "pending" },
    { label: "Đã giao hàng", value: "shipped" },
    { label: "Giao hàng thành công", value: "success" },
    { label: "Đã hủy", value: "cancel" },
  ];

  const formatDate = (dateString: string) => {
    if (!dateString) return "Chưa có ngày";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Ngày không hợp lệ";
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Ngày không hợp lệ";
    }
  };

  const filteredOrders =
    selectedStatus === "all"
      ? orders
      : orders.filter((order) => order.status === selectedStatus);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-pink-500">Lịch Sử Đơn Hàng</h2>

      <div className="mb-6">
        <div className="flex flex-nowrap gap-2 overflow-x-auto">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedStatus(filter.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                selectedStatus === filter.value
                  ? "bg-pink-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {filter.value !== "all" && statusIcons[filter.value]}
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 text-black">
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between py-4 border-b last:border-b-0"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <span className="font-medium block">
                      Mã đơn hàng: {order.orderNumber}
                    </span>
                    <div className="text-sm text-gray-600 flex items-center gap-1">
                      {statusIcons[order.status]}
                      <span>{statusMap[order.status]}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      Ngày đặt: {formatDate(order.date)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-medium block">
                    {formatPrice(order.totalAmount)}
                  </span>
                  <Link
                    href={`/order/${order.id}`}
                    className="text-pink-600 hover:text-pink-800 text-sm"
                  >
                    Xem sản phẩm
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            {selectedStatus === "all"
              ? "Bạn chưa có đơn hàng nào."
              : `Không có đơn hàng nào ở trạng thái "${statusMap[selectedStatus]}".`}
          </p>
        )}
      </div>
    </div>
  );
};

const AddressList = ({ addresses, onDelete }: { addresses: Address[]; onDelete: (id: number) => void }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4 text-pink-500">Sổ địa chỉ</h2>
    <div className="space-y-4 text-black">
      {addresses.map((addr) => (
        <div key={addr.id} className="p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="mb-1">
                {addr.name} - {addr.address}, {addr.ward.total_name}, {addr.district.full_name}, {addr.province.full_name}
              </p>
              <p className="text-gray-600">SĐT: {addr.phone_number}</p>
              {addr.default === "default" && (
                <span className="inline-block px-2 py-1 bg-pink-100 text-pink-600 text-xs rounded-full">Mặc định</span>
              )}
            </div>
            <div className="flex space-x-2">
              <Link href={`/address/${addr.id}`} className="text-blue-500 hover:text-blue-700 flex items-center">
                <Eye className="w-4 h-4 mr-1" /> Sửa
              </Link>
              {addr.default !== "default" && (
                <button onClick={() => onDelete(addr.id)} className="text-red-500 hover:text-red-700 flex items-center">
                  <Trash2 className="w-4 h-4 mr-1" /> Xóa
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
      {!addresses.length && <p className="text-gray-500">Chưa có địa chỉ nào được lưu</p>}
      <Link href="/address" className="inline-block bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600">
        + Thêm địa chỉ mới
      </Link>
    </div>
  </div>
);

const Vouchers = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserVouchers = async () => {
      const token = Cookies.get("accessToken");
      if (!token) return;

      try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/users/vouchers", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        const data = await response.json();
        
        if (data.status === "success" && data.data.vouchers) {
          setVouchers(data.data.vouchers);
        }
      } catch (error) {
        console.error("Error fetching user vouchers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserVouchers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-pink-500">Danh sách Voucher</h2>
      {vouchers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vouchers.map((voucher) => (
            <div
              key={voucher.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {voucher.title}
                </h3>
                <p className="text-gray-600 mb-4">{voucher.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Giá trị:</span>
                    <span className="font-medium text-pink-600">
                      {voucher.type === "percent"
                        ? `${voucher.discount_value}%`
                        : `${voucher.discount_value.toLocaleString()}đ`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tối đa:</span>
                    <span className="font-medium">
                      {voucher.max_discount_value.toLocaleString()}đ
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Đơn tối thiểu:</span>
                    <span className="font-medium">
                      {voucher.min_order_value.toLocaleString()}đ
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Hạn sử dụng:</span>
                    <span className="font-medium">
                      {voucher.ended_date
                        ? new Date(voucher.ended_date).toLocaleDateString("vi-VN")
                        : "Không có hạn"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-500">Bạn chưa có voucher nào</p>
          <Link href="/voucher" className="inline-block mt-4 px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600">
            Khám phá voucher
          </Link>
        </div>
      )}
    </div>
  );
};

const ChangePassword = () => (
  <div>
    <h2 className="text-xl font-semibold mb-4 text-pink-500">Đổi mật khẩu</h2>
    <Link href="/change-password" className="inline-flex items-center px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-md">
      <Eye className="w-4 h-4 mr-2" /> Đổi mật khẩu
    </Link>
  </div>
);

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [activeTab, setActiveTab] = useState("tai-khoan");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get("accessToken");
      const userData = Cookies.get("userData");

      if (!token || !userData) return router.push("/login");

      try {
        // Parse user data from cookie
        const user = JSON.parse(userData);
        setUser(user);

        // Fetch addresses
        const addressRes = await fetch("http://127.0.0.1:8000/api/v1/users/addresses", {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });
        if (!addressRes.ok) throw new Error("Addresses fetch failed");
        const addressData = await addressRes.json();
        setAddresses(addressData.data);

        // Fetch orders
        const ordersRes = await fetch("http://127.0.0.1:8000/api/v1/users/orders", {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });
        if (!ordersRes.ok) throw new Error("Orders fetch failed");
        const ordersData = await ordersRes.json();
        if (ordersData.data) {
          const formattedOrders = ordersData.data.map((order: any) => ({
            id: order.id,
            orderNumber: order.order_number,
            status: order.status,
            date: order.created_at,
            totalAmount: order.total_amount,
            items: order.items.map((item: any) => ({
              product: {
                name: item.product_name,
                price: item.price
              },
              quantity: item.quantity
            }))
          }));
          setOrders(formattedOrders);
        }

        // Fetch wishlist
        const wishlistRes = await fetch("http://127.0.0.1:8000/api/v1/users/favorites", {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
        if (!wishlistRes.ok) throw new Error("Wishlist fetch failed");
        const wishlistData = await wishlistRes.json();
        const favorites = wishlistData.data.favorites;

        const detailedItems = await Promise.all(
          favorites.map(async (favorite: any) => {
            const productRes = await fetch(`http://127.0.0.1:8000/api/v1/products/detail/${favorite.id}`, {
              headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            });
            const productData = await productRes.json();
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
        Swal.fire({ icon: "error", title: "Lỗi", text: "Không thể tải dữ liệu", confirmButtonColor: "#f472b6" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = async () => {
    const token = Cookies.get("accessToken");
    if (!token) return;

    try {
      await fetch("http://127.0.0.1:8000/api/v1/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      Cookies.remove("accessToken");
      Cookies.remove("userEmail");
      router.push("/login");
    } catch (error) {
      Swal.fire({ icon: "error", title: "Lỗi", text: "Đăng xuất thất bại", confirmButtonColor: "#f472b6" });
    }
  };

  const handleDeleteAddress = async (id: number) => {
    const result = await Swal.fire({
      title: "Xác nhận",
      text: "Bạn có chắc chắn muốn xóa địa chỉ này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f472b6",
      cancelButtonColor: "#d1d5db",
      confirmButtonText: "Xóa",
    });

    if (result.isConfirmed) {
      const token = Cookies.get("accessToken");
      try {
        const res = await fetch("http://127.0.0.1:8000/api/v1/users/delete-addresses", {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ address_id: id }),
        });
        if (!res.ok) throw new Error("Delete failed");
        setAddresses(addresses.filter((addr) => addr.id !== id));
        Swal.fire({ icon: "success", title: "Thành công", text: "Đã xóa địa chỉ", confirmButtonColor: "#f472b6" });
      } catch (error) {
        Swal.fire({ icon: "error", title: "Lỗi", text: "Không thể xóa địa chỉ", confirmButtonColor: "#f472b6" });
      }
    }
  };

  const handleRemoveWishlistItem = async (id: number) => {
    const result = await Swal.fire({
      title: "Xác nhận",
      text: "Bạn có chắc muốn xóa sản phẩm khỏi danh sách yêu thích?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#f472b6",
      cancelButtonColor: "#d1d5db",
      confirmButtonText: "Xóa",
    });

    if (result.isConfirmed) {
      const token = Cookies.get("accessToken");
      try {
        const res = await fetch("http://127.0.0.1:8000/api/v1/users/remove-favorite", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ product_id: id }),
        });
        if (!res.ok) throw new Error("Remove failed");
        setWishlistItems(wishlistItems.filter((item) => item.id !== id));
        Swal.fire({ icon: "success", title: "Thành công", text: "Đã xóa sản phẩm", confirmButtonColor: "#f472b6" });
      } catch (error) {
        Swal.fire({ icon: "error", title: "Lỗi", text: "Không thể xóa sản phẩm", confirmButtonColor: "#f472b6" });
      }
    }
  };

  const handleCancelOrder = (id: string) => {
    Swal.fire({
      title: "Xác nhận",
      text: "Bạn có chắc chắn muốn hủy đơn hàng?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f472b6",
      cancelButtonColor: "#d1d5db",
      confirmButtonText: "Hủy đơn",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedOrders = orders.map((order) => (order.id === id ? { ...order, status: "Đã hủy" } : order));
        setOrders(updatedOrders);
        localStorage.setItem("orders", JSON.stringify(updatedOrders));
        Swal.fire({ icon: "success", title: "Thành công", text: "Đơn hàng đã bị hủy", confirmButtonColor: "#f472b6" });
      }
    });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">Loading...</div>;
  if (!user) return <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">No user data available</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
              <span className="text-4xl text-gray-600">
                {user.first_name[0]}
                {user.last_name[0]}
              </span>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{`${user.first_name} ${user.last_name}`}</h1>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.role === "admin" ? "bg-red-100 text-red-800 border border-red-200" : "bg-pink-100 text-pink-800 border border-pink-200"
                  }`}
                >
                  {user.role === "admin" ? "Quản trị viên" : "Thành viên"}
                </span>
              </div>
              <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2">
                <Mail className="w-4 h-4" /> {user.email}
              </p>
            </div>
            <div className="flex gap-3">
            <Link href="/feedback" className="inline-flex items-center px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-md">
                <ShoppingCart className="w-4 h-4 mr-2" /> Đánh Giá 
              </Link>
              <Link href="/order" className="inline-flex items-center px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-md">
                <ShoppingCart className="w-4 h-4 mr-2" /> Đơn hàng
              </Link>
              <button onClick={handleLogout} className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md">
                <LogOut className="w-4 h-4 mr-2" /> Đăng xuất
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
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center py-3 px-4 text-sm font-medium rounded-lg mb-2 ${
                  activeTab === tab.id ? "bg-pink-100 text-pink-600" : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <tab.icon className="w-5 h-5 mr-3" /> {tab.label}
              </button>
            ))}
          </div>
          <div className="flex-1 p-6">
            {activeTab === "tai-khoan" && <UserInfo user={user} addresses={addresses} />}
            {activeTab === "yeu-thich" && <Wishlist items={wishlistItems} onRemove={handleRemoveWishlistItem} />}
            {activeTab === "don-hang" && <Orders orders={orders} onCancel={handleCancelOrder} />}
            {activeTab === "dia-chi" && <AddressList addresses={addresses} onDelete={handleDeleteAddress} />}
            {activeTab === "voucher" && <Vouchers />}
            {activeTab === "doi-mat-khau" && <ChangePassword />}
          </div>
        </div>
      </div>
    </div>
  );
}