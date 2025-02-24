// pages/admin/products.tsx
"use client"
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Home,
  Package,
  Users,
  ShoppingCart,
  BarChart2,
  Settings,
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Filter,
  Download
} from 'lucide-react'

interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  status: 'active' | 'inactive'
  image: string
}

export default function AdminProducts() {
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  // Mock data
  const products: Product[] = [
    {
      id: '1',
      name: 'Kem Dưỡng Ẩm Premium',
      category: 'Chăm sóc da',
      price: 890000,
      stock: 45,
      status: 'inactive',
      image: '/product1.jpg'
    },
    {
      id: '2',
      name: 'Son Lì Cao Cấp',
      category: 'Trang điểm',
      price: 450000,
      stock: 30,
      status: 'active',
      image: '/product2.jpg'
    },
    // Add more mock products...
  ]

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(products.map(p => p.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-30">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center">
            <Link href="/admin" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Logo"
                width={120}
                height={36}
                className="object-contain"
              />
              <span className="ml-2 text-lg font-semibold text-gray-900">Admin</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700">
              <Settings className="w-5 h-5" />
            </button>
            <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
              <span>Admin User</span>
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className="fixed left-0 top-[73px] bottom-0 w-64 bg-white border-r border-gray-200 z-20">
        <div className="flex flex-col h-full">
          <div className="flex-1 py-4">
            <nav className="space-y-1 px-3">
              <Link
                href="/admin"
                className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                <Home className="w-5 h-5 mr-3" />
                Dashboard
              </Link>
              <Link
                href="/admin/products"
                className="flex items-center px-3 py-2 text-pink-600 bg-pink-50 rounded-lg"
              >
                <Package className="w-5 h-5 mr-3" />
                Sản phẩm
              </Link>
              <Link
                href="/admin/categories"
                className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                <Package className="w-5 h-5 mr-3" />
                Danh mục
              </Link>
              <Link
                href="/admin/users"
                className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                <Users className="w-5 h-5 mr-3" />
                Người dùng
              </Link>
              <Link
                href="/admin/orders"
                className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                <ShoppingCart className="w-5 h-5 mr-3" />
                Đơn hàng
              </Link>
              <Link
                href="/admin/analytics"
                className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                <BarChart2 className="w-5 h-5 mr-3" />
                Doanh thu
              </Link>
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 pt-[73px] min-h-screen">
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-900">Sản phẩm</h1>
              <Link
                href="/admin/products/new"
                className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
              >
                <Plus className="w-5 h-5 mr-2" />
                Thêm sản phẩm
              </Link>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="col-span-2">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>
            <div>
              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Filter className="w-5 h-5 mr-2" />
                Lọc
              </button>
            </div>
            <div>
              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Download className="w-5 h-5 mr-2" />
                Xuất Excel
              </button>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          onChange={handleSelectAll}
                          checked={selectedItems.length === products.length}
                        />
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sản phẩm
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Danh mục
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giá
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tồn kho
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={selectedItems.includes(product.id)}
                          onChange={() => handleSelectItem(product.id)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 relative rounded overflow-hidden">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              SKU: {product.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {product.price.toLocaleString()}đ
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.stock}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.status === 'active' ? 'Đang bán' : 'Ngừng bán'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">10</span> của{' '}
                    <span className="font-medium">97</span> kết quả
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                      1
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-pink-50 text-sm font-medium text-pink-600">
                      2
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                      3
                    </button>
                    <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}