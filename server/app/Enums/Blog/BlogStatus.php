<?php declare(strict_types=1);

namespace App\Enums\Blog;

use BenSampo\Enum\Enum;

/**
 * @method static static Archived()
 * @method static static Draft()
 * @method static static Published()
 */
final class BlogStatus extends Enum
{
    const Archived = 'archived';
    const Draft = 'draft';
    const Published = 'published';

    public function label(): string
    {
        return match ($this->value) {
            self::Archived => 'Đang lưu trữ',
            self::Draft => 'Nháp',
            self::Published => 'Đã xuất bản',
            default => 'Không xác định',
        };
    }

    public static function getKeyValuePairs(): array
    {
        return [
            self::Archived => self::getLabel(self::Archived),
            self::Draft => self::getLabel(self::Draft),
            self::Published => self::getLabel(self::Published),
        ];
    }

    public function badge(): string
    {
        return match ($this->value) {
            self::Archived => "<span class='badge text-bg-danger text-white'>{$this->label()}</span>",
            self::Draft => "<span class='badge text-bg-secondary text-white'>{$this->label()}</span>",
            self::Published => "<span class='badge text-bg-primary text-white'>{$this->label()}</span>",
            default => "<span class='badge text-bg-info text-white'>Không xác định</span>",
        };
    }

    public static function getLabel(string $value): string
    {
        return match ($value) {
            self::Archived => 'Đang lưu trữ',
            self::Draft => 'Nháp',
            self::Published => 'Đã xuất bản',
            default => 'Không xác định',
        };
    }
}
