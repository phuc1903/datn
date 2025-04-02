import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { API_BASE_URL } from "@/config/config";
import { UserData, Address, Order, WishlistItem } from "@/types/profile";

export const useProfile = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    const token = Cookies.get("accessToken");
    const email = Cookies.get("userEmail");

    if (!token || !email) return router.push("/login");

    try {
      // Fetch user profile and addresses in parallel
      const [profileRes, addressRes] = await Promise.all([
        fetch(`${API_BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        }),
        fetch(`${API_BASE_URL}/users/addresses`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        }),
      ]);

      if (!profileRes.ok || !addressRes.ok) throw new Error("Data fetch failed");

      const [profileData, addressData] = await Promise.all([profileRes.json(), addressRes.json()]);
      const foundUser = profileData.data.find((u: UserData) => u.email === email);
      if (!foundUser) throw new Error("User not found");

      setUser(foundUser);
      setAddresses(addressData.data);

      // Load orders from localStorage
      const savedOrders = localStorage.getItem("orders");
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      // Fetch wishlist
      const wishlistRes = await fetch(`${API_BASE_URL}/users/favorites`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      if (!wishlistRes.ok) throw new Error("Wishlist fetch failed");
      const wishlistData = await wishlistRes.json();
      const favorites = wishlistData.data.favorites;

      // Fetch product details in parallel
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
    } catch (error) {
      Swal.fire({ icon: "error", title: "Lỗi", text: "Không thể tải dữ liệu", confirmButtonColor: "#f472b6" });
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = useCallback(async () => {
    const token = Cookies.get("accessToken");
    if (!token) return;

    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      Cookies.remove("accessToken");
      Cookies.remove("userEmail");
      router.push("/login");
    } catch (error) {
      Swal.fire({ icon: "error", title: "Lỗi", text: "Đăng xuất thất bại", confirmButtonColor: "#f472b6" });
    }
  }, [router]);

  const handleDeleteAddress = useCallback(async (id: number) => {
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
        setAddresses((prev) => prev.filter((addr) => addr.id !== id));
        Swal.fire({ icon: "success", title: "Thành công", text: "Đã xóa địa chỉ", confirmButtonColor: "#f472b6" });
      } catch (error) {
        Swal.fire({ icon: "error", title: "Lỗi", text: "Không thể xóa địa chỉ", confirmButtonColor: "#f472b6" });
      }
    }
  }, []);

  const handleRemoveWishlistItem = useCallback(async (id: number) => {
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
        setWishlistItems((prev) => prev.filter((item) => item.id !== id));
        Swal.fire({ icon: "success", title: "Thành công", text: "Đã xóa sản phẩm", confirmButtonColor: "#f472b6" });
      } catch (error) {
        Swal.fire({ icon: "error", title: "Lỗi", text: "Không thể xóa sản phẩm", confirmButtonColor: "#f472b6" });
      }
    }
  }, []);

  const handleCancelOrder = useCallback((id: number) => {
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
        setOrders((prev) => {
          const updatedOrders = prev.map((order) => (order.id === id ? { ...order, status: "Đã hủy" } : order));
          localStorage.setItem("orders", JSON.stringify(updatedOrders));
          return updatedOrders;
        });
        Swal.fire({ icon: "success", title: "Thành công", text: "Đơn hàng đã bị hủy", confirmButtonColor: "#f472b6" });
      }
    });
  }, []);

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