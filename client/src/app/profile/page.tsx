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
  id: number; // Updated to match API
  name: string;
  phone_number: string;
  address: string;
  province_code: string;
  district_code: string;
  ward_code: string;
  default: string;
  province: { full_name: string };
  district: { full_name: string };
  ward: { full_name: string };
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
              ? `${addresses.find((a) => a.default === "default")?.address}, ${
                  addresses.find((a) => a.default === "default")?.ward.full_name
                }, ${addresses.find((a) => a.default === "default")?.district.full_name}, ${
                  addresses.find((a) => a.default === "default")?.province.full_name
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
  const [activeStatus, setActiveStatus] = useState("tất cả");
  const statusList = ["Tất cả", "Đang xác nhận", "Đang đóng gói", "Đang giao hàng", "Đã giao", "Đã hủy"];
  const statusIcons = {
    "Đang xác nhận": <Package className="w-5 h-5 text-yellow-500" />,
    "Đang đóng gói": <Package className="w-5 h-5 text-blue-500" />,
    "Đang giao hàng": <Truck className="w-5 h-5 text-orange-500" />,
    "Đã giao": <CheckCircle className="w-5 h-5 text-green-500" />,
    "Đã hủy": <XCircle className="w-5 h-5 text-red-500" />,
  };

  const filteredOrders =
    activeStatus === "tất cả" ? orders : orders.filter((order) => order.status.toLowerCase() === activeStatus.toLowerCase());

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-pink-500">Lịch Sử Đơn Hàng</h2>
      <div className="mb-6 flex flex-wrap gap-2">
        {statusList.map((status) => (
          <button
            key={status}
            onClick={() => setActiveStatus(status.toLowerCase())}
            className={`px-3 py-2 rounded-lg text-sm ${
              activeStatus === status.toLowerCase() ? "bg-pink-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {status}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white text-black rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                {statusIcons[order.status as keyof typeof statusIcons]}
                <span className="font-medium text-gray-700">{order.status}</span>
              </div>
              <span className="text-sm text-gray-500">Mã Đơn: {order.orderNumber}</span>
            </div>
            <div className="space-y-2 mb-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <div className="text-sm text-gray-600">
                      {item.variants?.map((v) => `${v.name}: ${v.value}`).join(", ") || "Không có biến thể"}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">x{item.quantity}</span>
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
                  <span className="font-medium">{formatPrice(order.shipping)}</span>
                </div>
                <div className="flex items-center gap-2 text-base font-semibold">
                  <span className="text-gray-700">Tổng Cộng:</span>
                  <span className="text-pink-600">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              {order.status !== "Đã hủy" && order.status !== "Đã giao" && (
                <button className="text-pink-600 hover:text-pink-800" onClick={() => onCancel(order.id)}>
                  Hủy Đơn
                </button>
              )}
              <button className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700">Chi Tiết Đơn Hàng</button>
            </div>
          </div>
        ))}
        {!filteredOrders.length && <div className="text-center text-gray-500 py-8">Không có đơn hàng nào</div>}
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
                {addr.name} - {addr.address}, {addr.ward.full_name}, {addr.district.full_name}, {addr.province.full_name}
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

const Vouchers = () => (
  <div>
    <h2 className="text-xl font-semibold mb-4 text-pink-500">Danh sách Voucher</h2>
    <p>Chưa có voucher nào.</p>
  </div>
);

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
      const email = Cookies.get("userEmail");

      if (!token || !email) return router.push("/login");

      try {
        // Fetch user profile
        const profileRes = await fetch("http://127.0.0.1:8000/api/v1/users", {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });
        if (!profileRes.ok) throw new Error("Profile fetch failed");
        const profileData = await profileRes.json();
        const foundUser = profileData.data.find((u: UserData) => u.email === email);
        if (!foundUser) throw new Error("User not found");
        setUser(foundUser);

        // Fetch addresses
        const addressRes = await fetch("http://127.0.0.1:8000/api/v1/users/addresses", {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });
        if (!addressRes.ok) throw new Error("Addresses fetch failed");
        const addressData = await addressRes.json();
        setAddresses(addressData.data);

        // Load orders from localStorage
        const savedOrders = localStorage.getItem("orders");
        if (savedOrders) setOrders(JSON.parse(savedOrders));

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
          body: JSON.stringify({ address_id: id }), // Use the API-provided id
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