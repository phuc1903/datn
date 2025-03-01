<?php

declare(strict_types=1);

namespace App\Enums\User;

use BenSampo\Enum\Enum;

/**
 * @method static static Male()
 * @method static static Female()
 * @method static static Other()
 */
final class UserSex extends Enum
{
    const Male = 'male';
    const Female = 'female';
    const Other = 'other';
    public function label(): string
    {
        return match ($this->value) {
            self::Male => 'Nam',
            self::Female => 'Nữ',
            self::Other => 'Khác',
            default => 'Không xác định',
        };
    }

    public static function fromLabel(string $label): ?self
    {
        return match ($label) {
            'Nam' => new self(self::Male),
            'Nữ' => new self(self::Female),
            'Khác' => new self(self::Other),
            default => null,
        };
    }

    public function badge(): string
    {
        return match ($this->value) {
            self::Male => "<span class='badge text-bg-secondary text-white'>{$this->label()}</span>",
            self::Female => "<span class='badge text-bg-primary text-white'>{$this->label()}</span>",
            self::Other => "<span class='badge text-bg-warning text-white'>{$this->label()}</span>",
            default => "<span class='badge text-bg-info text-white'>Không xác định</span>",
        };
    }
}
