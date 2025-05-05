import Image from "next/image";
import Link from "next/link";

interface ComboCardProps {
  combo: {
    id: number;
    name: string;
    image_url: string;
    price: number;
    promotion_price: number;
    date_end: string;
    date_start: string;
    quantity: number;
  };
  isComingSoon?: boolean;
}

export default function ComboCard({ combo, isComingSoon = false }: ComboCardProps) {
  const discount = Math.round(
    ((combo.price - combo.promotion_price) / combo.price) * 100
  );
  
  const isOutOfStock = combo.quantity === 0 && !isComingSoon;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const formatPrice = (price: number, mask = false) => {
    if (!mask) return price.toLocaleString() + 'đ';
    
    const priceStr = price.toString();
    const firstDigit = priceStr[0];
    const length = priceStr.length;
    return firstDigit + 'x'.repeat(length - 1) + 'đ';
  };

  const CardContent = () => (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 ${isOutOfStock ? "" : "group-hover:scale-105"} h-[450px] relative`}>
      <div className="relative aspect-square">
        <Image
          src={combo.image_url}
          alt={combo.name}
          fill
          className="object-cover"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-gray-800/60 flex items-center justify-center z-10">
            <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium">
              Hết hàng
            </span>
          </div>
        )}
        <div className={`absolute top-2 left-2 ${isComingSoon ? 'bg-blue-600' : isOutOfStock ? 'bg-gray-600' : 'bg-red-600'} text-white px-2 py-1 rounded-md text-sm z-20`}>
          {isComingSoon ? 'Sắp mở bán' : isOutOfStock ? 'Hết hàng' : `-${discount}%`}
        </div>
      </div>
      <div className="p-4 flex flex-col h-[210px]">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-3 flex-none">
          {combo.name}
        </h3>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-pink-600 font-bold text-xl">
              {isComingSoon ? formatPrice(combo.promotion_price, true) : formatPrice(combo.promotion_price)}
            </p>
            <p className="text-gray-500 line-through text-sm">
              {formatPrice(combo.price)}
            </p>
          </div>
          <div className={`text-sm ${isOutOfStock ? "text-red-500 font-semibold" : "text-gray-600"}`}>
            {isOutOfStock ? "Hết hàng" : `Còn lại: ${combo.quantity}`}
          </div>
        </div>
        <div className="bg-gray-50 p-2 rounded-lg mt-auto">
          <p className="text-xs text-gray-500">
            {isComingSoon ? 'Mở bán:' : 'Kết thúc:'}
          </p>
          <p className="text-sm font-medium text-gray-800">
            {formatDate(isComingSoon ? combo.date_start : combo.date_end)}
          </p>
        </div>
      </div>
    </div>
  );

  if (isComingSoon) {
    return <div className="group"><CardContent /></div>;
  }

  return (
    <Link href={`/combo/${combo.id}`} className="group">
      <CardContent />
    </Link>
  );
}