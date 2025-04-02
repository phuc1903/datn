<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;
    protected $guarded = [];

    /**
     * Các loại setting cần thêm URL vào đường dẫn
     */
    protected $imageTypes = [
        'logoHeaderLightMode',
        'logoHeaderDarkMode',
        'logoFooterLightMode',
        'logoFooterDarkMode',
        'favicon',
        'logo',
        'IconSite',
        'imageActionSignUpHome'
    ];

    /**
     * Tự động thêm URL backend khi trả về giá trị
     */
    public function getValueAttribute($value)
    {
        // Kiểm tra tên setting có phải là hình ảnh không
        if (in_array($this->name, $this->imageTypes) && $value) {
            return asset($value);
        }

        return $value;
    }

    /**
     * Lấy giá trị gốc không qua accessor
     */
    public function getOriginalValue()
    {
        return $this->getRawOriginal('value');
    }
}
