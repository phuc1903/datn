<?php declare(strict_types=1);

namespace App\Enums\Product;

use BenSampo\Enum\Enum;

/**
 * @method static static Active()
 * @method static static Hidden()
 * @method static static Pending()
 * @method static static Banned()
 * @method static static badge()
 * @method static static label()
 */
final class ProductFeedbackStatus extends Enum
{
    const Active = 'active';
    const Hidden = 'hidden';
    const Pending = 'pending';
    const Banned = 'banned';

    public function label(): string
    {
        return match ($this->value) {
            self::Active => "Đang hoạt động",
            self::Hidden => "Đang ẩn",
            self::Pending => "Đang viết",
            self::Banned => "Đang khóa",
            default => "Không xác định",
        };
    }
    public function badge(): string
    {
        return match ($this->value) {
            self::Active => "<span class='badge text-bg-success text-white'>{$this->label()}</span>",
            self::Hidden => "<span class='badge text-bg-neuture text-white'>{$this->label()}</span>",
            self::Pending => "<span class='badge text-bg-warning text-white'>{$this->label()}</span>",
            self::Banned => "<span class='badge text-bg-danger text-white'>{$this->label()}</span>",
            default => "<span class='badge text-bg-info text-white'> Không xác định</span>",
        };
    }

}
