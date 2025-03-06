"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ShoppingCartIcon, Heart } from "lucide-react";
import Cookies from "js-cookie";
import Swal from 'sweetalert2';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderImages, setSliderImages] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [hotProducts, setHotProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showVariantPopup, setShowVariantPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSku, setSelectedSku] = useState(null);
  const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: string }>({});
  const [quantity, setQuantity] = useState(1);
  const [actionType, setActionType] = useState<"addToCart" | "buyNow" | null>(null);
  const [userFavorites, setUserFavorites] = useState(new Set());

  const getRandomItems = (arr: any[], num: number) => {
    if (!arr || !Array.isArray(arr) || arr.length === 0) return [];
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(num, arr.length));
  };

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });

  const fetchUserFavorites = async (token) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/users/favorites", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.status === "success" && Array.isArray(data.data.favorites)) {
        setUserFavorites(new Set(data.data.favorites.map(item => item.id)));
      } else {
        console.warn("Dữ liệu yêu thích không hợp lệ:", data);
      }
    } catch (error) {
      console.error("Error fetching user favorites:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch sliders
        const slidersRes = await fetch("http://127.0.0.1:8000/api/v1/sliders");
        const slidersData = await slidersRes.json();
        setSliderImages(slidersData.data?.map((item) => item.image_url) || []);

        // Fetch products
        const productsRes = await fetch("http://127.0.0.1:8000/api/v1/products");
        const productsData = await productsRes.json();
        const inStockProducts = productsData.data?.filter((product) => product.status !== "out_of_stock") || [];
        setProducts(inStockProducts);

        // Chọn ngẫu nhiên 10 sản phẩm cho các section
        setHotProducts(getRandomItems(inStockProducts.filter((p) => p.is_hot), 4));
        setNewProducts(getRandomItems(
          inStockProducts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
          10
        ));
        setRecommended(getRandomItems(inStockProducts, 10));

        // Fetch favorite products
        const favoritesRes = await fetch("http://127.0.0.1:8000/api/v1/products/most-favorites");
        const favoritesData = await favoritesRes.json();
        setFavoriteProducts(getRandomItems(favoritesData.data || [], 10));

        // Fetch categories
        const categoriesRes = await fetch("http://127.0.0.1:8000/api/v1/categories");
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData.data || []);

        // Fetch blogs
        const blogsRes = await fetch("http://127.0.0.1:8000/api/v1/blogs");
        const blogsData = await blogsRes.json();
        if (blogsData?.status === "success") {
          setBlogs(getRandomItems(blogsData.data || [], 3));
        }

        // Fetch user favorites if logged in
        const token = Cookies.get("accessToken");
        if (token) {
          await fetchUserFavorites(token);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (sliderImages.length > 0 ? (prev + 1) % sliderImages.length : 0));
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleToggleFavorite = async (productId) => {
    const token = Cookies.get("accessToken");
    if (!token) {
      Toast.fire({
        icon: 'error',
        title: 'Vui lòng đăng nhập để sử dụng tính năng này'
      });
      return;
    }

    const isFavorited = userFavorites.has(productId);
    const url = isFavorited 
      ? "http://127.0.0.1:8000/api/v1/users/remove-favorite"
      : "http://127.0.0.1:8000/api/v1/users/add-favorite";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: productId }),
      });

      if (!response.ok) {
        throw new Error("Thao tác thất bại");
      }

      const result = await response.json();
      if (result.status === "success") {
        // Cập nhật lại danh sách yêu thích từ server
        await fetchUserFavorites(token);
        
        Toast.fire({
          icon: 'success',
          title: isFavorited ? 'Đã xóa khỏi danh sách yêu thích' : 'Đã thêm vào danh sách yêu thích'
        });
      }
    } catch (error) {
      console.error("Favorite error:", error);
      Toast.fire({
        icon: 'error',
        title: 'Có lỗi xảy ra. Vui lòng thử lại'
      });
    }
  };

  if (loading) return <p className="text-center text-lg">Đang tải dữ liệu...</p>;

  const displayedCategories = showAllCategories ? categories : getRandomItems(categories, 4);

  const variantOptions = (product) => {
    const options: { [key: string]: Set<string> } = {};
    product?.skus.forEach((sku) => {
      sku.variant_values.forEach((variant) => {
        if (!options[variant.variant.name]) {
          options[variant.variant.name] = new Set();
        }
        options[variant.variant.name].add(variant.value);
      });
    });
    return options;
  };

  const handleVariantChange = (e: React.MouseEvent, variantName: string, value: string) => {
    e.stopPropagation();
    const newSelectedVariants = { ...selectedVariants, [variantName]: value };
    setSelectedVariants(newSelectedVariants);

    const matchedSku = selectedProduct.skus.find((sku) =>
      sku.variant_values.every(
        (variant) =>
          newSelectedVariants[variant.variant.name] === variant.value ||
          !newSelectedVariants[variant.variant.name]
      )
    );
    if (matchedSku) {
      setSelectedSku(matchedSku);
    }
    setQuantity(1);
  };

  const handleAction = (product, type: "addToCart" | "buyNow") => {
    setSelectedProduct(product);
    setSelectedSku(product.skus[0]);
    setSelectedVariants({});
    setQuantity(1);
    setActionType(type);
    setShowVariantPopup(true);
  };

  const handleConfirmAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedSku || !selectedProduct) return;

    const cartItem = {
      sku_id: selectedSku.id,
      name: selectedProduct.name,
      image_url: selectedSku.image_url,
      price: selectedSku.promotion_price > 0 ? selectedSku.promotion_price : selectedSku.price,
      quantity: quantity,
      variants: selectedSku.variant_values.map((variant) => ({
        name: variant.variant.name,
        value: variant.value,
      })),
    };

    if (actionType === "addToCart") {
      const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existingItem = storedCart.find((item) => item.sku_id === selectedSku.id);
      let updatedCart;

      if (existingItem) {
        updatedCart = storedCart.map((item) =>
          item.sku_id === selectedSku.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, selectedSku.quantity) }
            : item
        );
      } else {
        updatedCart = [...storedCart, cartItem];
      }

      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } else if (actionType === "buyNow") {
      console.log("Buy Now:", cartItem);
    }

    setShowVariantPopup(false);
  };

  const ProductCard = ({ product }) => (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden group p-4">
      <Link href={`/product/${product.id}`}>
        <div className="relative w-full aspect-square mb-4 overflow-hidden">
          <Image
            src={product.images?.[0]?.image_url || product.skus?.[0]?.image_url || "/oxy.jpg"}
            alt={product.name}
            fill
            className="object-cover transform transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      </Link>
      <div className="flex flex-wrap gap-2 mb-3">
        {product.categories.map((category) => (
          <span
            key={category.id}
            className="bg-green-100 text-green-600 text-xs font-medium px-2 py-1 rounded-full"
          >
            {category.name}
          </span>
        ))}
      </div>
      <h3 className="text-sm font-medium mb-2 line-clamp-2 text-gray-800">{product.name}</h3>
      <div className="mb-4">
        <span className="line-through text-gray-500 text-sm mr-2">
          {product.skus?.[0]?.price.toLocaleString()}đ
        </span>
        <span className="text-pink-600 font-bold text-lg">
          {(product.skus?.[0]?.promotion_price || product.skus?.[0]?.price).toLocaleString()}đ
        </span>
      </div>
      <div className="flex items-center justify-between space-x-2 mb-4">
        <div className="flex items-center space-x-2">
        <button
          onClick={() => handleAction(product, "buyNow")}
          className="bg-gray-900 text-white px-6 py-2 rounded hover:bg-gray-800"
        >
          Mua
        </button>
          <button
            onClick={() => handleAction(product, "addToCart")}
            className="bg-pink-600 text-white p-2 rounded hover:bg-pink-700"
            title="Thêm vào giỏ hàng"
          >
            <ShoppingCartIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleToggleFavorite(product.id)}
            className={`p-2 rounded ${
              userFavorites.has(product.id) ? "text-red-600" : "text-gray-400"
            } hover:text-red-700`}
            title="Thêm vào yêu thích"
          >
            <Heart className="w-5 h-5" fill={userFavorites.has(product.id) ? "currentColor" : "none"} />
          </button>
        </div>
        
      </div>
    </div>
  );

  const HotProductCard = ({ product, isLarge = false }) => (
    <Link href={`/product/${product.id}`} className="block">
      <div className={`relative bg-white rounded-lg shadow-lg overflow-hidden group ${isLarge ? "md:h-[600px]" : "h-[192px]"}`}>
        <Image
          src={product.images?.[0]?.image_url || "/oxy.jpg"}
          alt={product.name}
          fill
          className="object-cover transform transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className={`font-semibold text-white mb-2 line-clamp-${isLarge ? "2" : "1"} ${isLarge ? "text-2xl" : "text-base"}`}>
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {product.skus?.[0]?.promotion_price > 0 ? (
                <>
                  <span className="line-through text-gray-300 text-sm">
                    {product.skus?.[0]?.price.toLocaleString()}đ
                  </span>
                  <span className="text-white font-bold">
                    {product.skus?.[0]?.promotion_price.toLocaleString()}đ
                  </span>
                </>
              ) : (
                <span className="text-white font-bold">
                  {product.skus?.[0]?.price.toLocaleString()}đ
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
            <button
                onClick={(e) => {
                  e.preventDefault();
                  handleAction(product, "buyNow");
                }}
                className="bg-gray-900 text-white px-6 py-2 rounded hover:bg-gray-800"
              >
                Mua
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleAction(product, "addToCart");
                }}
                className="bg-pink-600 text-white p-2 rounded hover:bg-pink-700"
                title="Thêm vào giỏ hàng"
              >
                <ShoppingCartIcon className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleToggleFavorite(product.id);
                }}
                className={`p-2 rounded ${
                  userFavorites.has(product.id) ? "text-red-600" : "text-gray-400"
                } hover:text-red-700`}
                title="Thêm vào yêu thích"
              >
                <Heart className="w-5 h-5" fill={userFavorites.has(product.id) ? "currentColor" : "none"} />
              </button>
              
            </div>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Slider Section */}
      <section className="w-full px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="relative h-[400px] w-full overflow-hidden rounded-lg">
            {sliderImages.map((image, index) => (
              <div
                key={index}
                className={`absolute w-full h-full transition-opacity duration-500 ${
                  currentSlide === index ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={image}
                  alt={`Slide ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            ))}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {sliderImages.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    currentSlide === index ? "bg-white" : "bg-white/50"
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="w-full px-4 py-12 bg-pink-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Danh Mục Sản Phẩm</h2>
            {!showAllCategories && categories.length > 4 && (
              <button
                onClick={() => setShowAllCategories(true)}
                className="text-pink-600 hover:text-pink-700 font-medium"
              >
                Xem tất cả
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {displayedCategories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group relative h-48 bg-white rounded-lg shadow-md overflow-hidden"
              >
                <img
                  src={`http://127.0.0.1:8000/${category.image}`}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-xl font-semibold">{category.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Sản Phẩm Hot</h2>
          <Link href="/bestsellers" className="text-pink-600 hover:text-pink-700 font-medium">
            Xem tất cả
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hotProducts.length > 0 && <HotProductCard product={hotProducts[0]} isLarge={true} />}
          <div className="flex flex-col gap-4">
            {hotProducts.slice(1, 4).map((product) => (
              <HotProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Login Ads */}
      <section className="py-16 overflow-hidden bg-pink-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Đăng ký tài khoản tại ZBeauty</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Hãy đăng ký tài khoản trên website của chúng tôi để luôn nhận được thông tin mới nhất về sản phẩm, khuyến mãi và các sự kiện đặc biệt.
              </p>
              <div className="flex gap-4">
                <Link href="/register">
                  <button className="bg-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors">
                    Đăng ký tài khoản
                  </button>
                </Link>
                <Link href="/shop">
                  <button className="bg-white text-pink-600 px-6 py-3 rounded-lg font-medium hover:bg-pink-600 hover:text-white transition-colors">
                    Xem tất cả sản phẩm
                  </button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full bg-pink-50 relative">
                <Image src="/img.png" alt="Person using phone" fill className="object-cover rounded-full p-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Products Section */}
      <section className="w-full px-4 py-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Sản phẩm mới</h2>
            <Link href="/new-products" className="text-pink-600 hover:text-pink-700 font-medium">
              Xem tất cả
            </Link>
          </div>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={5}
            navigation={{ nextEl: ".swiper-button-next-new", prevEl: ".swiper-button-prev-new" }}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{ 0: { slidesPerView: 2 }, 768: { slidesPerView: 4 }, 1024: { slidesPerView: 5 } }}
          >
            {newProducts.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
            <div className="swiper-button-prev-new text-pink-600" />
            <div className="swiper-button-next-new text-pink-600" />
          </Swiper>
        </div>
      </section>

      {/* Recommended Section */}
      <section className="w-full px-4 py-12 bg-pink-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Dành cho bạn</h2>
            <Link href="/recommended" className="text-pink-600 hover:text-pink-700 font-medium">
              Xem tất cả
            </Link>
          </div>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={5}
            navigation={{ nextEl: ".swiper-button-next-recommended", prevEl: ".swiper-button-prev-recommended" }}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{ 0: { slidesPerView: 2 }, 768: { slidesPerView: 4 }, 1024: { slidesPerView: 5 } }}
          >
            {recommended.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
                        <div className="swiper-button-prev-recommended text-pink-600" />
            <div className="swiper-button-next-recommended text-pink-600" />
          </Swiper>
        </div>
      </section>

      {/* Favorite Products Section */}
      <section className="w-full px-4 py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Sản phẩm được yêu thích</h2>
          </div>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={5}
            navigation={{ nextEl: ".swiper-button-next-favorite", prevEl: ".swiper-button-prev-favorite" }}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{ 0: { slidesPerView: 2 }, 768: { slidesPerView: 4 }, 1024: { slidesPerView: 5 } }}
          >
            {favoriteProducts.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
            <div className="swiper-button-prev-favorite text-pink-600" />
            <div className="swiper-button-next-favorite text-pink-600" />
          </Swiper>
        </div>
      </section>

      {/* Blog Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Góc làm đẹp</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Image
                src={blog.image_url || "/default-blog.jpg"}
                alt={blog.title}
                width={400}
                height={225}
                className="object-cover w-full h-40"
              />
              <div className="p-4">
                <h3 className="text-lg text-black font-bold mb-2">{blog.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{blog.short_description}</p>
                <Link href={`/blog/${blog.id}`} className="text-pink-600 hover:text-pink-700 font-medium">
                  Đọc thêm
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 bg-gray-50">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Hỗ trợ khách hàng</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { question: "Làm sao để đặt hàng?", answer: "Bạn có thể đặt hàng trực tiếp trên website hoặc liên hệ qua hotline." },
            { question: "Chính sách đổi trả?", answer: "Hỗ trợ đổi trả trong 7 ngày kể từ khi nhận hàng." },
            { question: "Sản phẩm chính hãng?", answer: "Tất cả sản phẩm đều nhập khẩu chính hãng và có hóa đơn." },
          ].map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <h4 className="font-bold text-gray-800 mb-2">{faq.question}</h4>
              <p className="text-sm text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-pink-100 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Đăng ký nhận tin</h2>
          <p className="text-gray-600 mb-8">Nhận thông tin về sản phẩm mới và khuyến mãi hấp dẫn</p>
          <form className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              Đăng ký
            </button>
          </form>
        </div>
      </section>

      {/* Variant Popup */}
      {showVariantPopup && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4 text-black">{selectedProduct.name}</h3>
            <div className="space-y-4">
              {Object.entries(variantOptions(selectedProduct)).map(([variantName, values]) => (
                <div key={variantName}>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">{variantName}:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Array.from(values).map((value) => (
                      <button
                        key={value}
                        className={`border rounded-lg py-2 px-4 text-sm font-medium ${
                          selectedVariants[variantName] === value
                            ? "border-pink-600 text-pink-600"
                            : "border-gray-200 text-gray-900 hover:border-gray-300"
                        }`}
                        onClick={(e) => handleVariantChange(e, variantName, value)}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Số lượng:</h4>
                <div className="flex items-center space-x-2 text-black">
                  <button
                    className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuantity(Math.max(1, quantity - 1));
                    }}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={selectedSku?.quantity || 1}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, Math.min(parseInt(e.target.value) || 1, selectedSku?.quantity || 1)))
                    }
                    className="w-16 h-8 border border-gray-300 rounded text-center"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuantity(Math.min(quantity + 1, selectedSku?.quantity || 1));
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600">Còn lại: {selectedSku?.quantity} sản phẩm</p>
              <p className="text-lg font-bold text-pink-600">
                {(selectedSku?.promotion_price > 0 ? selectedSku.promotion_price : selectedSku?.price).toLocaleString()}đ
              </p>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowVariantPopup(false);
                }}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                onClick={handleConfirmAction}
              >
                {actionType === "addToCart" ? "Thêm vào giỏ" : "Mua ngay"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}