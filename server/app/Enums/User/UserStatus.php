<?php

declare(strict_types=1);

namespace App\Enums\User;

use BenSampo\Enum\Enum;

/**
 * @method static static Active()
 * @method static static Banned()
 * @method static static OptionThree()
 */
final class UserStatus extends Enum
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

    /**
     * Chuyển chuỗi tiếng Việt thành giá trị Enum
     */
    public static function fromLabel(string $label): ?self
    {
        return match ($label) {
            'Đang hoạt động' => new self(self::Active),
            'Đang bị khóa' => new self(self::Banned),
            default => null,
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
}
