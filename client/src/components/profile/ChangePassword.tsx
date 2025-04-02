import React from "react";
import Link from "next/link";
import { Eye } from "lucide-react";

const ChangePassword = () => (
  <div>
    <h2 className="text-xl font-semibold mb-4 text-pink-500">Đổi mật khẩu</h2>
    <Link href="/change-password" className="inline-flex items-center px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-md">
      <Eye className="w-4 h-4 mr-2" /> Đổi mật khẩu
    </Link>
  </div>
);

export default React.memo(ChangePassword); 