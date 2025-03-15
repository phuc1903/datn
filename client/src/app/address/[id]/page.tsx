"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

export default function EditAddressPage() {
  const { id } = useParams(); // Lấy address_id từ URL
  const router = useRouter();
  const [locations, setLocations] = useState<any>(null);
  const [userAddresses, setUserAddresses] = useState<any>(null);
  const [formData, setFormData] = useState({
    address: "",
    provinceCode: "",
    districtCode: "",
    wardCode: "",
    name: "",
    phoneNumber: "",
    default: "other",
  });
  const [errors, setErrors] = useState({
    address: "",
    provinceCode: "",
    districtCode: "",
    wardCode: "",
    name: "",
    phoneNumber: "",
  });

  // State to control dropdown enable/disable
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [isDistrictEnabled, setIsDistrictEnabled] = useState(false);
  const [isWardEnabled, setIsWardEnabled] = useState(false);

  // Fetch location data and user addresses
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/get-location-in-vn");
        if (!response.ok) throw new Error("Không thể tải dữ liệu địa phương");
        const data = await response.json();
        setLocations(data.data);
      } catch (error) {
        console.error("Error fetching locations:", error);
        Swal.fire({
          title: "Lỗi!",
          text: "Không thể tải dữ liệu địa chỉ.",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#db2777",
        });
      }
    };

    const fetchUserAddresses = async () => {
      try {
        const token = Cookies.get("accessToken");
        if (!token) throw new Error("Không tìm thấy token xác thực");

        const response = await fetch("http://127.0.0.1:8000/api/v1/users/addresses", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Không thể tải danh sách địa chỉ");
        const data = await response.json();
        setUserAddresses(data.data);
      } catch (error) {
        console.error("Error fetching user addresses:", error);
        Swal.fire({
          title: "Lỗi!",
          text: error.message || "Không thể tải danh sách địa chỉ.",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#db2777",
        });
      }
    };

    fetchLocations();
    fetchUserAddresses();
  }, []);

  // Update formData when userAddresses is loaded
  useEffect(() => {
    if (userAddresses && locations) {
      const address = userAddresses.find((addr: any) => addr.id === parseInt(id as string));
      if (address) {
        setFormData({
          address: address.address || "",
          provinceCode: address.province_code || "",
          districtCode: address.district_code || "",
          wardCode: address.ward_code || "",
          name: address.name || "",
          phoneNumber: address.phone_number || "",
          default: address.default || "other",
        });
        setIsDistrictEnabled(!!address.province_code);
        setDistricts(
          locations.find((loc: any) => loc.code === address.province_code)?.districts || []
        );
        setIsWardEnabled(!!address.district_code);
        setWards(
          locations
            .find((loc: any) => loc.code === address.province_code)
            ?.districts.find((dist: any) => dist.code === address.district_code)?.wards || []
        );
      } else {
        Swal.fire({
          title: "Lỗi!",
          text: "Không tìm thấy địa chỉ với ID này.",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#db2777",
        });
      }
    }
  }, [userAddresses, locations, id]);

  // Handle province change
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceCode = e.target.value;
    setFormData((prev) => ({ ...prev, provinceCode, districtCode: "", wardCode: "" }));
    setIsDistrictEnabled(!!provinceCode);
    setIsWardEnabled(false);
    setDistricts(locations?.find((loc: any) => loc.code === provinceCode)?.districts || []);
    setWards([]);
    setErrors((prev) => ({ ...prev, provinceCode: "" }));
  };

  // Handle district change
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtCode = e.target.value;
    setFormData((prev) => ({ ...prev, districtCode, wardCode: "" }));
    setIsWardEnabled(!!districtCode);
    const selectedDistrict = districts.find((dist: any) => dist.code === districtCode);
    setWards(selectedDistrict?.wards || []);
    setErrors((prev) => ({ ...prev, districtCode: "" }));
  };

  // Handle ward change
  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const wardCode = e.target.value;
    setFormData((prev) => ({ ...prev, wardCode }));
    setErrors((prev) => ({ ...prev, wardCode: "" }));
  };

  // Handle other form inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "default" : "other") : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    const newErrors = {
      address: !formData.address ? "Vui lòng nhập địa chỉ chi tiết" : "",
      provinceCode: !formData.provinceCode ? "Vui lòng chọn tỉnh/thành phố" : "",
      districtCode: !formData.districtCode ? "Vui lòng chọn quận/huyện" : "",
      wardCode: !formData.wardCode ? "Vui lòng chọn phường/xã" : "",
      name: !formData.name ? "Vui lòng nhập tên địa chỉ" : "",
      phoneNumber: !formData.phoneNumber || !/^\d{10,11}$/.test(formData.phoneNumber)
        ? "Số điện thoại không hợp lệ (10-11 số)"
        : "",
    };

    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);
      return;
    }

    try {
      const token = Cookies.get("accessToken");
      if (!token) {
        throw new Error("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
      }

      const response = await fetch("http://127.0.0.1:8000/api/v1/users/update-addresses", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          address_id: id,
          address: formData.address,
          province_code: formData.provinceCode,
          district_code: formData.districtCode,
          ward_code: formData.wardCode,
          name: formData.name,
          phone_number: formData.phoneNumber,
          default: formData.default,
        }),
      });

      const result = await response.json();
      console.log("API Response:", result);

      if (!response.ok) {
        throw new Error(result.message || "Cập nhật địa chỉ thất bại");
      }

      if (result.status === "success") {
        await Swal.fire({
          title: "Thành công!",
          text: "Địa chỉ đã được cập nhật thành công!",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#db2777",
        });
        router.push("/profile"); // Chuyển hướng về trang profile sau khi thành công
      }
    } catch (error: any) {
      console.error("Update address error:", error);
      Swal.fire({
        title: "Lỗi!",
        text: error.message || "Cập nhật địa chỉ thất bại. Vui lòng thử lại.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#db2777",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Sửa Địa Chỉ</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Address Input */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ chi tiết
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border ${
                errors.address ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 text-black focus:ring-pink-500 focus:border-transparent transition-all`}
              placeholder="Nhập số nhà, đường, v.v."
              required
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          {/* Province Dropdown */}
          <div>
            <label htmlFor="provinceCode" className="block text-sm font-medium text-gray-700 mb-1">
              Tỉnh/Thành phố
            </label>
            <select
              id="provinceCode"
              name="provinceCode"
              value={formData.provinceCode}
              onChange={handleProvinceChange}
              className={`w-full px-4 py-2 border ${
                errors.provinceCode ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 text-black focus:ring-pink-500 focus:border-transparent transition-all`}
              required
            >
              <option value="">Chọn tỉnh/thành phố</option>
              {locations &&
                locations.map((loc: any) => (
                  <option key={loc.code} value={loc.code}>
                    {loc.full_name}
                  </option>
                ))}
            </select>
            {errors.provinceCode && <p className="text-red-500 text-sm mt-1">{errors.provinceCode}</p>}
          </div>

          {/* District Dropdown */}
          <div>
            <label htmlFor="districtCode" className="block text-sm font-medium text-gray-700 mb-1">
              Quận/Huyện
            </label>
            <select
              id="districtCode"
              name="districtCode"
              value={formData.districtCode}
              onChange={handleDistrictChange}
              className={`w-full px-4 py-2 border ${
                errors.districtCode ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 text-black focus:ring-pink-500 focus:border-transparent transition-all`}
              disabled={!isDistrictEnabled}
              required
            >
              <option value="">Chọn quận/huyện</option>
              {districts.map((dist: any) => (
                <option key={dist.code} value={dist.code}>
                  {dist.full_name}
                </option>
              ))}
            </select>
            {errors.districtCode && <p className="text-red-500 text-sm mt-1">{errors.districtCode}</p>}
          </div>

          {/* Ward Dropdown */}
          <div>
            <label htmlFor="wardCode" className="block text-sm font-medium text-gray-700 mb-1">
              Phường/Xã
            </label>
            <select
              id="wardCode"
              name="wardCode"
              value={formData.wardCode}
              onChange={handleWardChange}
              className={`w-full px-4 py-2 border ${
                errors.wardCode ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 text-black focus:ring-pink-500 focus:border-transparent transition-all`}
              disabled={!isWardEnabled}
              required
            >
              <option value="">Chọn phường/xã</option>
              {wards.map((ward: any) => (
                <option key={ward.code} value={ward.code}>
                  {ward.full_name}
                </option>
              ))}
            </select>
            {errors.wardCode && <p className="text-red-500 text-sm mt-1">{errors.wardCode}</p>}
          </div>

          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Tên địa chỉ
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 text-black focus:ring-pink-500 focus:border-transparent transition-all`}
              placeholder="Nhập tên địa chỉ (như nhà riêng, công ty...)"
              required
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Phone Number Input */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border ${
                errors.phoneNumber ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 text-black focus:ring-pink-500 focus:border-transparent transition-all`}
              placeholder="Nhập số điện thoại (10-11 số)"
              required
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
          </div>

          {/* Default Checkbox */}
          <div className="flex items-center">
            <input
              id="default"
              name="default"
              type="checkbox"
              checked={formData.default === "default"}
              onChange={handleInputChange}
              className="h-4 w-4 text-pink-600 rounded border-gray-300 focus:ring-pink-500"
            />
            <label htmlFor="default" className="ml-2 block text-sm text-gray-700">
              Đặt làm địa chỉ mặc định
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 text-white bg-pink-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Cập nhật địa chỉ
          </button>
        </form>
      </div>
    </div>
  );
}