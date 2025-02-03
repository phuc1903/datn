"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Home,
  Package,
  Users,
  List,
  Edit,
  Trash,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Download,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive";
}

export default function AdminCategories() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Mock data
  const categories: Category[] = [
    {
      id: "1",
      name: "Điện tử",
      description: "Các sản phẩm điện tử như điện thoại, laptop...",
      status: "active",
    },
    {
      id: "2",
      name: "Thời trang",
      description: "Quần áo, phụ kiện thời trang.",
      status: "inactive",
    },
    // Thêm danh mục nếu cần...
  ];

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedCategories(categories.map((category) => category.id));
    } else {
      setSelectedCategories([]);
    }
  };

  const handleSelectCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id)
        ? prev.filter((categoryId) => categoryId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-30">
        <div className="flex items-center justify-between px-4 py-4">
          <Link href="/admin" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Logo"
              width={120}
              height={36}
              className="object-contain"
            />
            <span className="ml-2 text-lg font-semibold text-gray-900">
              Admin
            </span>
          </Link>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className="fixed left-0 top-[73px] bottom-0 w-64 bg-white border-r border-gray-200 z-20">
        <nav className="py-4 space-y-1 px-3">
          <Link
            href="/admin"
            className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            <Home className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            <Package className="w-5 h-5 mr-3" />
            Sản phẩm
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            <Users className="w-5 h-5 mr-3" />
            Người dùng
          </Link>
          <Link
            href="/admin/categories"
            className="flex items-center px-3 py-2 text-pink-600 bg-pink-50 rounded-lg"
          >
            <List className="w-5 h-5 mr-3" />
            Danh mục
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 pt-[73px]">
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Danh mục</h1>
            <Link
              href="/admin/categories/new"
              className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
            >
              Thêm danh mục
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm danh mục..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <button className="w-full flex items-center justify-center px-4 py-2 border rounded-lg hover:bg-gray-50">
              <Filter className="w-5 h-5 mr-2" />
              Lọc
            </button>
            <button className="w-full flex items-center justify-center px-4 py-2 border rounded-lg hover:bg-gray-50">
              <Download className="w-5 h-5 mr-2" />
              Xuất Excel
            </button>
          </div>

          {/* Categories Table */}
          <div className="bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      onChange={handleSelectAll}
                      checked={selectedCategories.length === categories.length}
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Mô tả
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => handleSelectCategory(category.id)}
                      />
                    </td>
                    <td className="px-6 py-4">{category.name}</td>
                    <td className="px-6 py-4">{category.description}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          category.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {category.status === "active"
                          ? "Hoạt động"
                          : "Tạm ngừng"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <button className="text-gray-600 hover:text-gray-900">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button className="text-gray-600 hover:text-red-600">
                          <Trash className="w-5 h-5" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between bg-white px-4 py-3 border-t border-gray-200">
            <p className="text-sm text-gray-700">
              Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">10</span> của
              <span className="font-medium"> 50</span> danh mục
            </p>
            <nav className="inline-flex">
              <button className="px-2 py-2 border rounded-l-md">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="px-4 py-2 border bg-pink-50 text-pink-600">1</button>
              <button className="px-4 py-2 border">2</button>
              <button className="px-4 py-2 border">3</button>
              <button className="px-2 py-2 border rounded-r-md">
                <ChevronRight className="w-5 h-5" />
              </button>
            </nav>
          </div>
        </div>
      </main>
    </div>
  );
}
