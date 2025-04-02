<?php

namespace App\Http\Requests\Admin\Product;

use App\Http\Requests\Admin\BaseRequest;

class VariantRequest extends BaseRequest
{
    protected $customMessage = [
        'name.required' => 'Vui lòng nhập Thuộc tính.',
        'name.string' => 'Thuộc tính phải là một chuỗi.',
        'name.max' => 'Thuộc tính không được vượt quá 30 ký tự.',
        'name.min' => 'Thuộc tính ít nhất 3 ký tự',
        'name.unique' => "Thuộc tính này đã có",

        'variants.required' => "Vui lòng thêm biến thể",
        'variants.array' => "Biến thể phải là mảng (dev error)",
        'variants.min' => "Nhập ít nhất một biến thể",
    ];

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */

    protected function methodPost(): array
    {
        return [
            'name' => ['required', 'string', 'min:3', 'max:30', 'unique:variants,name' . $this->variant],
            'variants' => ['required', 'array', 'min:1'],
        ];
    }

    protected function methodPut(): array
    {
        return [
            'name' => ['required', 'string', 'min:3', 'max:30', 'unique:variants,name,'.$this->route('variant')->id.',id'],
            'variants' => ['required', 'array', 'min:1'],
        ];
    }
}
