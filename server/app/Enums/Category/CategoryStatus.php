<?php

declare(strict_types=1);

namespace App\Enums\Category;

use BenSampo\Enum\Enum;

/**
 * @method static static Active()
 * @method static static Hidden()
 */
final class CategoryStatus extends Enum
{
    const Active = 'active';
    const Hidden = 'hidden';

    public function label(): string
    {
        return match ($this->value) {
            self::Active => "Đang hoạt động",
            self::Hidden => "Đang ẩn",
            default => "Không xác định",
        };
    }

    public function badge(): string
    {
        return match ($this->value) {
            self::Active => "<span class='badge text-bg-success text-white'>{$this->label()}</span>",
            self::Hidden => "<span class='badge text-bg-neuture text-white'>{$this->label()}</span>",
            default => "<span class='badge text-bg-info text-white'> Không xác định</span>",
        };
    }

    public static function getKeyValuePairs(): array
    {
        return [
            self::Active => self::getLabel(self::Active),
            self::Hidden => self::getLabel(self::Hidden),
        ];
    }

    public static function getLabel(string $value): string
    {
        return match ($value) {
            self::Active => "Đang hoạt động",
            self::Hidden => "Đang ẩn",
            default => "Không xác định",
        };
    }
}
