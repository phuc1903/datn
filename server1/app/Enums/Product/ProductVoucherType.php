<?php declare(strict_types=1);

namespace App\Enums\Product;

use BenSampo\Enum\Enum;

/**
 * @method static static Category()
 * @method static static Product()
 * @method static static label()
 * @method static static badge()
 */
final class ProductVoucherType extends Enum
{
    const Category = 'category';
    const Product = 'product';

    public function label(): string
    {
        return match ($this->value) {
            self::Category => 'Danh mục',
            self::Product => 'Sản phẩm',
            default => 'Không xác định',
        };
    }

    public function badge(): string
    {
        return match ($this->value) {
            self::Category => "<span class='badge text-bg-secondary text-white'>{$this->label()}</span>",
            self::Product => "<span class='badge text-bg-primary text-white'>{$this->label()}</span>",
            default => "<span class='badge text-bg-info text-white'>Không xác định</span>",
        };
    }
}
