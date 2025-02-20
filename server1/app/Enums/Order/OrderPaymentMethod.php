<?php declare(strict_types=1);

namespace App\Enums\Order;

use BenSampo\Enum\Enum;

/**
 * @method static static Cod()
 * @method static static Bank()
 */
final class OrderPaymentMethod extends Enum
{
    const Cod = 'cod';
    const Bank = 'bank';

    public function label(): string
    {
        return match ($this->value) {
            self::Cod => 'Tiền mặt',
            self::Bank => 'Chuyển khoản',
            default => 'Không xác định',
        };
    }

    public function badge(): string
    {
        return match ($this->value) {
            self::Cod => "<span class='badge text-bg-secondary text-white'>{$this->label()}</span>",
            self::Bank => "<span class='badge text-bg-primary text-white'>{$this->label()}</span>",
            default => "<span class='badge text-bg-info text-white'>Không xác định</span>",
        };
    }
}
