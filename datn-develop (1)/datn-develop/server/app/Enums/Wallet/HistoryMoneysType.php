<?php declare(strict_types=1);

namespace App\Enums\Wallet;

use BenSampo\Enum\Enum;

/**
 * @method static static Deposit()
 * @method static static Withdraw()
 * @method static static Shopping()
 */
final class HistoryMoneysType extends Enum
{
    const Deposit = 'deposit';
    const Withdraw = 'withdraw';
    const Shopping = 'shopping';

    public function label(): string
    {
        return match ($this->value) {
            self::Deposit => 'Nạp tiền',
            self::Withdraw => 'Rút tiền',
            self::Shopping => 'Mua sắm',
            default => 'Không xác định',
        };
    }
    
    public function badge(): string
    {
        return match ($this->value) {
            self::Deposit => "<span class='badge text-bg-secondary text-white'>{$this->label()}</span>",
            self::Withdraw => "<span class='badge text-bg-primary text-white'>{$this->label()}</span>",
            self::Shopping => "<span class='badge text-bg-neuture text-white'>{$this->label()}</span>",
            default => "<span class='badge text-bg-info text-white'>Không xác định</span>",
        };
    }
}
