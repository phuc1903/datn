<?php declare(strict_types=1);

namespace App\Enums\Combo;

use BenSampo\Enum\Enum;

/**
 * @method static static No()
 * @method static static Hot()
 */
final class ComboHot extends Enum
{
    const Hot = 1;
    const No = 0;

    public function badge(): string
    {
        return match ($this->value) {
            self::Hot => "<span class='badge text-bg-primary text-white'>{$this->label()}</span>",
            self::No => "<span class='badge text-bg-neuture text-white'>{$this->label()}</span>",
            default => "<span class='badge text-bg-info text-white'> Không xác định</span>",
        };
    }

    public function label(): string
    {
        return match ($this->value) {
            self::Hot => "Đang hot",
            self::No => "Không",
            default => "Không xác định",
        };
    }

    public static function getKeyValuePairs(): array
    {
        return [
            self::Hot => self::getLabel(self::Hot),
            self::No => self::getLabel(self::No),
        ];
    }

    public static function getLabel(int $value): string
    {
        return match ($value) {
            self::Hot => 'Đang hot',
            self::No => 'Không',
            default => 'Không xác định',
        };
    }
}
