"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Mail, ShoppingCart, LogOut, Heart, Gift, Lock, MapPin } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import UserInfo from "@/components/profile/UserInfo";
import Wishlist from "@/components/profile/Wishlist";
import Orders from "@/components/profile/Orders";
import AddressList from "@/components/profile/AddressList";
import Vouchers from "@/components/profile/Vouchers";
import ChangePassword from "@/components/profile/ChangePassword";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("tai-khoan");
  const {
    user,
    addresses,
    orders,
    wishlistItems,
    loading,
    handleLogout,
    handleDeleteAddress,
    handleRemoveWishlistItem,
    handleCancelOrder,
  } = useProfile();

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">Loading...</div>;
  if (!user) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="text-xl text-gray-600">Không tìm thấy thông tin người dùng</div>
      <div className="text-sm text-gray-500">Vui lòng đăng nhập lại để tiếp tục</div>
      <button 
        onClick={handleLogout} 
        className="inline-flex items-center px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-md"
      >
        <LogOut className="w-4 h-4 mr-2" /> Đăng nhập lại
      </button>
    </div>
  );

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