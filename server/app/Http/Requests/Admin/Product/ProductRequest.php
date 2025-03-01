<?php

namespace App\Http\Requests\Admin\Product;

use App\Enums\Product\ProductStatus;
use BenSampo\Enum\Rules\EnumValue;
use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    protected $customMessage = [
        'name.required' => 'Vui lòng nhập tiêu đề.',
        'name.string' => 'Tiêu đề phải là một chuỗi.',
        'name.max' => 'Tiêu đề không được vượt quá 255 ký tự.',
        'name.min' => 'Tiêu đề ít nhất 10 ký tự',
        'short_description.required' => 'Vui lòng nhập đoạn mô tả ngắn.',
        'short_description.max' => 'Mô tả ngắn không được vượt quá 100 ký tự.',
        'short_description.min' => 'Mô tả ngắn ít nhất 30 ký tự.',
        'short_description.string' => 'Mô tả ngắn phải là một chuỗi.',
        'description.required' => 'Vui lòng nhập đoạn mô tả.',
        'description.max' => 'Mô tả ngắn không được vượt quá 1000 ký tự.',
        'description.min' => 'Mô tả ngắn ít nhất 100 ký tự.',
        'description.string' => 'Mô tả ngắn phải là một chuỗi.',
        'status.required' => 'Vui lòng chọn trạng thái',
        'is_hot.required' => 'Vui lòng chọn nổi bậc',
    ];
    public function methodGet()
    {
        return [
            'id' => ['required', 'exists:App\Models\Product,id'],
        ];
    }
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    protected function methodPost(): array
    {
        return [
            'name' => ['required', 'string', 'min:10', 'max:255'],
            'short_description' => ['required', 'string', 'min:10', 'max:60'],
            'description' => ['required', 'string', 'min:50', 'max:1000'],
            'status' => ['required', new EnumValue(ProductStatus::class)],
            'is_hot' => ['required'],
        ];
    }
}
