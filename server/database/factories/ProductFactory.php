<?php

namespace Database\Factories;

use App\Enums\Product\ProductStatus;
use App\Models\Product;
use App\Models\Admin;
use App\Models\ProductFeedback;
use App\Models\ProductImage;
use App\Models\ProductTag;
use App\Models\Sku;
use App\Models\SkuVariant;
use App\Models\Tag;
use App\Models\User;
use App\Models\Variant;
use App\Models\VariantValue;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    /**
     * Đặc điểm mô hình này.
     *
     * @var string
     */
    protected $model = Product::class;

    private const COUNT_SKU = 2; // Số lượng sản phẩm chi tiết
    private const COUNT_VARIANT = 6; // Số lượng biến thể của sản phẩm chi tiết

    /**
     * Định nghĩa mẫu dữ liệu cho factory.
     *
     * @return array
     */
    public function definition()
    {
        // Tên product & slug
        $name = $this->faker->sentence(5);

        return [
            'admin_id' => Admin::inRandomOrder()->first()->id,
            'name' => $name,
            'short_description' => $this->faker->sentence(),
            'description' => $this->faker->paragraph(),
            'status' => $this->faker->randomElement(ProductStatus::getValues()),
            'slug' => Str::slug($name),
            'is_hot' => $this->faker->randomElement([1,0]),
            'created_at' => now(),
            'updated_at' => now()
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (Product $product) {
            // Gọi hàm tạo biến thể
            $countSKU = (self::COUNT_SKU == 0) ? $this->faker->numberBetween(1, 5) : self::COUNT_SKU; // Nếu COUNT_SKU = 0 thì random 1 - 5
            $countVariant = (self::COUNT_VARIANT == 0) ? $this->faker->numberBetween(1, 3) : self::COUNT_VARIANT; // Nếu COUNT_VARIANT = 0 thì random 1 - 3
            $this->createVariant($product->id, $countSKU, $countVariant);
        });
    }

    // Tạo sản phẩm chi tiết
    public function createVariant($productId, $countSKU = 1, $countVariant = 2)
    {
        $variantIds = []; // Lưu danh sách variant_id đã dùng

        for ($i = 0; $i < $countSKU; $i++) {
            // Tạo SKU (thông tin chi tiết từng sản phẩm)
            $skuId = $this->createSku($productId);

            // Nếu đây là lần đầu tiên, tạo danh sách variant_id
            if (empty($variantIds)) {
                $variantIds = Variant::inRandomOrder()->limit($countVariant)->pluck('id')->toArray();
            }

            // Duyệt qua danh sách variant_id và tạo VariantValue mới
            foreach ($variantIds as $variantId) {
                $variantValueId = $this->createVariantValue($variantId);

                // Tạo mối quan hệ giữa SKU và VariantValue
                SkuVariant::create([
                    'sku_id' => $skuId,
                    'variant_value_id' => $variantValueId,
                ]);
            }
        }
    }

    // Tạo SKU
    public function createSku($productId)
    {
        // Giá sản phẩm
        $price = $this->faker->numberBetween(100000, 2500000);

        // Tạo SKU ngẫu nhiên cho sản phẩm
        $sku = SKU::create([
            'product_id' => $productId,
            'sku_code' => strtoupper(Str::random(10)),
            'price' => $price,
            'promotion_price' => $price / 2,
            'quantity' => $this->faker->randomNumber(2, true),
            'image_url' => 'https://placehold.co/600x400',
            'created_at' => now(),
            'updated_at' => now()
        ]);

        return $sku->id;
    }

    // Tạo giá trị biến thể
    public function createVariantValue($variantId)
    {
        $variantValue = VariantValue::create([
            'variant_id' => $variantId,
            'value' => $this->faker->word(),
        ]);

        return $variantValue->id;
    }
}
