<?php

declare(strict_types=1);

namespace App\Enums\Product;

use BenSampo\Enum\Enum;

/**
 * @method static static Active()
 * @method static static Archived()
 * @method static static OutOfStock()
 * @method static static badge()
 */
final class ProductStatus extends Enum
{
    const Active = 'active';
    const Archived = 'archived';
    const OutOfStock = 'out_of_stock';

    public function badge(): string
    {
        return match ($this->value) {
            self::Active => "<span class='badge text-bg-success text-white'>{$this->label()}</span>",
            self::Archived => "<span class='badge text-bg-danger text-white'>{$this->label()}</span>",
            self::OutOfStock => "<span class='badge text-bg-warning text-white'>{$this->label()}</span>",
            default => "<span class='badge text-bg-info text-white'> Không xác định</span>",
        };
    }

    public function label(): string
    {
        return match ($this->value) {
            self::Active => "Đang hoạt động",
            self::Archived => "Đang lưu trữ",
            self::OutOfStock => "Hết hàng",
            default => "Không xác định",
        };
    }
}
