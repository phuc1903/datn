<?php

declare(strict_types=1);

namespace App\Enums\Order;

use BenSampo\Enum\Enum;

/**
 * @method static static Pending()
 * @method static static Shipped()
 * @method static static Success()
 * @method static static Cancel()
 */
final class OrderStatus extends Enum
{
    const Waiting = 'waiting';
    const Pending = 'pending';
    const Shipped = 'shipped';
    const Success = 'success';
    const Cancel = 'cancel';

    public function label(): string
    {
        return match ($this->value) {
            self::Waiting => "Chờ thanh toán",
            self::Pending => "Đang xử lý",
            self::Shipped => "Đã giao hàng",
            self::Success => "Đơn thành công",
            self::Cancel => "Đã hủy",
            default => "Không xác định",
        };
    }
    public function badge(): string
    {
        return match ($this->value) {
            self::Waiting => "<span class='badge text-bg-warning text-white'>{$this->label()}</span>",
            self::Pending => "<span class='badge text-bg-neuture text-white'>{$this->label()}</span>",
            self::Shipped => "<span class='badge text-bg-primary text-white'>{$this->label()}</span>",
            self::Success => "<span class='badge text-bg-success text-white'>{$this->label()}</span>",
            self::Cancel => "<span class='badge text-bg-danger text-white'>{$this->label()}</span>",
            default => "<span class='badge text-bg-info text-white'> Không xác định</span>",
        };
    }

    public function canTransitionTo(self $newStatus): bool
    {
        $validTransitions = [
            self::Waiting => [self::Pending],
            self::Pending => [self::Shipped],
            self::Shipped => [self::Success],
            self::Success => [],
            self::Cancel => [],
        ];

        if($newStatus->value === self::Success && $newStatus->value === self::Cancel) {
            return false;
        }

        if ($newStatus->value === self::Cancel) {
            return true;
        }

        return in_array($newStatus->value, $validTransitions[$this->value] ?? []);
    }
}
