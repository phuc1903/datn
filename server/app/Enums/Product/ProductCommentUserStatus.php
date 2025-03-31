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
final class ProductCommentUserStatus extends Enum
{
    const Disable = 'disable';
    const Enable = 'enable';

    public function label(): string
    {
        return match ($this->value) {
            self::Disable => "Không ẩn danh",
            self::Enable => "Ẩn danh",
            default => "Không xác định",
        };
    }
    public function badge(): string
    {
        return match ($this->value) {
            self::Disable => "<span class='badge text-bg-success text-white'>{$this->label()}</span>",
            self::Enable => "<span class='badge text-bg-neuture text-white'>{$this->label()}</span>",
            default => "<span class='badge text-bg-info text-white'> Không xác định</span>",
        };
    }

}
