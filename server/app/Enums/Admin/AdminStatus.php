<?php declare(strict_types=1);

namespace App\Enums\Admin;

use BenSampo\Enum\Enum;

/**
 * @method static static Active()
 * @method static static Banned()
 * @method static static label()
 * @method static static badge()
 */
final class AdminStatus extends Enum
{
    const Active = 'active';
    const Banned = 'banned';

    public function label(): string
    {
        return match ($this->value) {
            self::Active => "Đang hoạt động",
            self::Banned => "Đang bị khóa",
            default => "Không xác định",
        };
    }
    public function badge(): string
    {
        return match ($this->value) {
            self::Active => "<span class='badge text-bg-success text-white'>{$this->label()}</span>",
            self::Banned => "<span class='badge text-bg-danger text-white'>{$this->label()}</span>",
            default => "<span class='badge text-bg-info text-white'> Không xác định</span>",
        };
    }

    public static function getKeyValuePairs(): array
    {
        return [
            self::Active => self::getLabel(self::Active),
            self::Banned => self::getLabel(self::Banned),
        ];
    }

    public static function getLabel(string $value): string
    {
        return match ($value) {
            self::Active => 'Đang hoạt động',
            self::Banned => 'Đang bị khóa',
            default => 'Không xác định',
        };
    }
}
