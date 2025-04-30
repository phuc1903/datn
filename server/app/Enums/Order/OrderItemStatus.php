<?php declare(strict_types=1);

namespace App\Enums\Order;

use BenSampo\Enum\Enum;

/**
 * @method static static Pending()
 * @method static static Shipped()
 * @method static static Success()
 * @method static static Cancel()
 */
final class OrderItemStatus extends Enum
{
    const Pending = 'pending';
    const Success = 'success';


    public function label(): string
    {
        return match ($this->value) {
            self::Pending => "Chưa đánh giá",
            self::Success => "Đã đánh giá",
            default => "Không xác định",
        };
    }
    public function badge(): string
    {
        return match ($this->value) {
            self::Pending => "<span class='badge text-bg-neuture text-white'>{$this->label()}</span>",
            self::Success => "<span class='badge text-bg-success text-white'>{$this->label()}</span>",
            default => "<span class='badge text-bg-info text-white'> Không xác định</span>",
        };
    }
}
