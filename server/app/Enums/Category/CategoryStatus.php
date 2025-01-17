<?php declare(strict_types=1);

namespace App\Enums\Category;

use BenSampo\Enum\Enum;

/**
 * @method static static OptionOne()
 * @method static static OptionTwo()
 * @method static static OptionThree()
 */
final class CategoryStatus extends Enum
{
    const OptionOne = 0;
    const OptionTwo = 1;
    const OptionThree = 2;
}
