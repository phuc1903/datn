<?php declare(strict_types=1);

namespace App\Enums\Slide;

use BenSampo\Enum\Enum;

/**
 * @method static static Pending()
 * @method static static Complete()
 * @method static static Approved()
 */
final class SlideStatus extends Enum
{
    const Pending = 1;   
    const Complete = 2; 
    const Approved = 3;

}
