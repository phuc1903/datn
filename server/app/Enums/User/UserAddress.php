<?php

declare(strict_types=1);

namespace App\Enums\User;

use BenSampo\Enum\Enum;

/**
 * @method static static Default()
 * @method static static Other()
 */
final class UserAddress extends Enum
{
    const Default = 'default';
    const Other = 'other';
    public function label(): string
    {
        return match ($this->value) {
            self::Default => 'Mặc Định',
            self::Other => 'Khác',
            default => 'Không xác định',
        };
    }

    public function badge(): string
    {
        return match ($this->value) {
            self::Default => "<span class='badge text-bg-secondary text-white'>{$this->label()}</span>",
            self::Other => "<span class='badge text-bg-warning text-white'>{$this->label()}</span>",
            default => "<span class='badge text-bg-info text-white'>Không xác định</span>",
        };
    }
}
