import React, { useMemo } from "react";
import { User, Mail, Phone, MapPin } from "lucide-react";
import { UserData, Address } from "@/types/profile";

interface UserInfoProps {
  user: UserData;
  addresses: Address[];
}

const UserInfo = ({ user, addresses }: UserInfoProps) => {
  const defaultAddress = useMemo(() => {
    const addr = addresses.find((a) => a.default === "default");
    if (!addr) return "Chưa cập nhật";
    return `${addr.address}, ${addr.ward.full_name}, ${addr.district.full_name}, ${addr.province.full_name}`;
  }, [addresses]);

  return (
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
            value={defaultAddress}
            readOnly
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(UserInfo); 