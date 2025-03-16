<?php declare(strict_types=1);

namespace App\Enums\Module;

use BenSampo\Enum\Enum;

/**
 * @method static static Pending()
 * @method static static Complete()
 * @method static static Approved()
 */
final class ModuleStatus extends Enum
{
    const Pending = 1;   
    const Complete = 2; 
    const Approved = 3;

    public function label(): string
    {
        return match ($this->value) {
            self::Pending => "Đang chờ",
            self::Complete => "Đã hoàn thành",
            self::Approved => "Đã duyệt",
            default => "Không xác định",
        };
    }
    public function badge(): string
    {
        return match ($this->value) {
            self::Pending => "<span class='badge text-bg-success text-white'>{$this->label()}</span>",
            self::Complete => "<span class='badge text-bg-danger text-white'>{$this->label()}</span>",
            self::Approved => "<span class='badge text-bg-danger text-white'>{$this->label()}</span>",
            default => "<span class='badge text-bg-info text-white'> Không xác định</span>",
        };
    }

    public static function getKeyValuePairs(): array
    {
        return [
            self::Pending => self::getLabel(self::Pending),
            self::Complete => self::getLabel(self::Complete),
            self::Approved => self::getLabel(self::Approved),
        ];
    }

    public static function getLabel(string $value): string
    {
        return match ($value) {
            self::Pending => 'Đang chờ',
            self::Complete => 'Đã hoàn thành',
            self::Approved => 'Đã duyệt',
            default => 'Không xác định',
        };
    }

}
