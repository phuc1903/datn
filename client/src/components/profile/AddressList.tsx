import React from "react";
import Link from "next/link";
import { Eye, Trash2 } from "lucide-react";
import { Address } from "@/types/profile";

interface AddressListProps {
  addresses: Address[];
  onDelete: (id: number) => void;
}

const AddressList = ({ addresses, onDelete }: AddressListProps) => (
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

export default React.memo(AddressList); 