import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { API_BASE_URL } from '@/config/config';

export interface UserData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role?: string;
}

export interface Address {
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
  ward: { full_name: string };
}

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  variants?: { name: string; value: string }[];
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: string;
  items: OrderItem[];
  shipping: number;
  totalAmount: number;
}

export interface WishlistItem {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  image: string;
  inStock: boolean;
}

export const useUserProfile = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleLogout = async () => {
    const token = Cookies.get("accessToken");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      Cookies.remove("accessToken");
      Cookies.remove("userEmail");
      router.push("/login");
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
        const res = await fetch(`${API_BASE_URL}/users/delete-addresses`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ address_id: id }),
        });
        if (!res.ok) throw new Error("Delete failed");
        setAddresses(addresses.filter((addr) => addr.id !== id));
        Swal.fire({ icon: "success", title: "Thành công", text: "Đã xóa địa chỉ", confirmButtonColor: "#f472b6" });
      } catch (err) {
        console.error("Delete address error:", err);
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
        const res = await fetch(`${API_BASE_URL}/users/remove-favorite`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ product_id: id }),
        });
        if (!res.ok) throw new Error("Remove failed");
        setWishlistItems(wishlistItems.filter((item) => item.id !== id));
        Swal.fire({ icon: "success", title: "Thành công", text: "Đã xóa sản phẩm", confirmButtonColor: "#f472b6" });
      } catch (err) {
        console.error("Remove wishlist item error:", err);
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

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get("accessToken");
      const email = Cookies.get("userEmail");

      if (!token || !email) {
        setLoading(false);
        return;
      }

      try {
        // Fetch user profile
        const [profileRes, addressRes, wishlistRes] = await Promise.all([
          fetch(`${API_BASE_URL}/users`, {
            headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
          }),
          fetch(`${API_BASE_URL}/users/addresses`, {
            headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
          }),
          fetch(`${API_BASE_URL}/users/favorites`, {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          }),
        ]);

        if (!profileRes.ok || !addressRes.ok || !wishlistRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [profileData, addressData, wishlistData] = await Promise.all([
          profileRes.json(),
          addressRes.json(),
          wishlistRes.json(),
        ]);

        const foundUser = profileData.data.find((u: UserData) => u.email === email);
        if (!foundUser) throw new Error("User not found");

        setUser(foundUser);
        setAddresses(addressData.data);

        // Load orders from localStorage
        const savedOrders = localStorage.getItem("orders");
        if (savedOrders) setOrders(JSON.parse(savedOrders));

        // Process wishlist items
        const favorites = wishlistData.data.favorites;
        const detailedItems = await Promise.all(
          favorites.map(async (favorite: { id: number; name: string; status: string }) => {
            const productRes = await fetch(`${API_BASE_URL}/products/detail/${favorite.id}`, {
              headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            });
            const productData = await productRes.json();
            const product = productData.data;
            const firstSku = product.skus[0];
            return {
              id: favorite.id,
              name: favorite.name,
              brand: "Various",
              price: firstSku.promotion_price > 0 ? firstSku.promotion_price : firstSku.price,
              originalPrice: firstSku.price,
              image: firstSku.image_url,
              inStock: favorite.status !== "out_of_stock",
            };
          })
        );
        setWishlistItems(detailedItems);
      } catch (err) {
        console.error("Fetch data error:", err);
        Swal.fire({ icon: "error", title: "Lỗi", text: "Không thể tải dữ liệu", confirmButtonColor: "#f472b6" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  return {
    user,
    addresses,
    orders,
    wishlistItems,
    loading,
    handleLogout,
    handleDeleteAddress,
    handleRemoveWishlistItem,
    handleCancelOrder,
  };
}; 