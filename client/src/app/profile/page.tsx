"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, MapPin, ShoppingCart, LogOut } from "lucide-react";

interface UserData {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    role?: string;
    address?: string;
}

export default function ProfilePage() {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = sessionStorage.getItem("accessToken");
            const email = sessionStorage.getItem("userEmail");

            if (!token || !email) {
                console.warn("No token or email found, redirecting to login.");
                router.push("/login");
                return;
            }

            try {
                const response = await fetch("http://127.0.0.1:8000/api/users", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Accept": "application/json"
                    }
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        alert("Session expired. Please login again.");
                        sessionStorage.clear();
                        router.push("/login");
                    }
                    return;
                }

                const result = await response.json();
                const foundUser = result.data.find((u: UserData) => u.email === email);
                
                if (!foundUser) {
                    alert("User not found.");
                    return;
                }

                setUser(foundUser);
            } catch (error) {
                console.error("Error fetching profile:", error);
                alert("Failed to fetch profile.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    const handleLogout = async () => {
        const token = sessionStorage.getItem("accessToken");
        if (!token) return;

        try {
            await fetch("http://127.0.0.1:8000/api/auth/logout", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            });

            sessionStorage.clear();
            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error);
            alert("Logout failed. Try again.");
        }
    };

    const getRoleBadgeStyle = (role?: string) => {
        return role === "admin" 
            ? "bg-red-100 text-red-800 border border-red-200" 
            : "bg-blue-100 text-blue-800 border border-blue-200";
    };

    const getRoleText = (role?: string) => {
        return role === "admin" ? "Quản trị viên" : "Thành viên";
    };

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            <p className="text-xl text-gray-600">Loading...</p>
        </div>
    );

    if (!user) return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            <p className="text-xl text-gray-600">No user data available.</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Avatar Section */}
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
                                <span className="text-4xl text-gray-600">
                                    {user.first_name[0]}{user.last_name[0]}
                                </span>
                            </div>
                        </div>
                        
                        {/* Basic Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                {`${user.first_name} ${user.last_name}`}
                            </h1>
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeStyle(user.role)}`}>
                                    {getRoleText(user.role)}
                                </span>
                            </div>
                            <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2">
                                <Mail className="w-4 h-4" />
                                {user.email}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <a
                                href="/order"
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Đơn hàng
                            </a>
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

                {/* Profile Information */}
                <div className="bg-white rounded-xl shadow-lg p-6">
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
                                    value={user.address || "Chưa cập nhật"}
                                    readOnly
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}