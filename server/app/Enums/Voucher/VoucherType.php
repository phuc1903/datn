<?php declare(strict_types=1);

namespace App\Enums\Voucher;

use BenSampo\Enum\Enum;

/**
 * @method static static Percent()
 * @method static static Price()
 */
final class VoucherType extends Enum
{
    const Percent = 'percent';
    const Price = 'price';

    public function label(): string
    {
        return match ($this->value) {
            self::Percent => 'Theo phần trăm',
            self::Price => 'Theo tiền cụ thể',
            default => 'Không xác định',
        };
    }

    public function badge(): string
    {
        return match ($this->value) {
            self::Percent => "<span class='badge text-bg-secondary text-white'>{$this->label()}</span>",
            self::Price => "<span class='badge text-bg-primary text-white'>{$this->label()}</span>",
            default => "<span class='badge text-bg-info text-white'>Không xác định</span>",
        };
    }

    public static function getKeyValuePairs(): array
    {
        return [
            self::Percent => self::getLabel(self::Percent),
            self::Price => self::getLabel(self::Price),
        ];
    }

    public static function getLabel(string $value): string
    {
        return match ($value) {
            self::Percent => 'Theo phần trăm',
            self::Price => 'Theo tiền cụ thể',
            default => 'Không xác định',
        };
    }
}
