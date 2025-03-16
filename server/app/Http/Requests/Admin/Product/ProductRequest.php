<?php

namespace App\Http\Requests\Admin\Product;

use App\Enums\Product\ProductStatus;
use App\Http\Requests\Admin\BaseRequest;
use BenSampo\Enum\Rules\EnumValue;

class ProductRequest extends BaseRequest
{
    protected $customMessage = [
        'name.required' => 'Vui lòng nhập tên sản phẩm.',
        'name.string' => 'Tên sản phẩm phải là một chuỗi.',
        'name.max' => 'Tên sản phẩm không được vượt quá 255 ký tự.',
        'name.min' => 'Tên sản phẩm ít nhất 10 ký tự',
        'short_description.required' => 'Vui lòng nhập đoạn mô tả ngắn.',
        'short_description.max' => 'Mô tả ngắn không được vượt quá 100 ký tự.',
        'short_description.min' => 'Mô tả ngắn ít nhất 30 ký tự.',
        'short_description.string' => 'Mô tả ngắn phải là một chuỗi.',
        'description.required' => 'Vui lòng nhập đoạn mô tả.',
        'description.min' => 'Mô tả ngắn ít nhất 100 ký tự.',
        'description.string' => 'Mô tả ngắn phải là một chuỗi.',
        'status.required' => 'Vui lòng chọn trạng thái',
        'is_hot.required' => 'Vui lòng chọn nổi bậc',
        'promotion_price.max' => "Vui lòng nhập giá dưới 10 chữ số",
        'promotion_price.numeric' => "Vui lòng nhập giá là số",
        'price.max' => "Vui lòng nhập giá khuyến mãi dưới 10 chữ số",
        'price.numeric' => "Vui lòng nhập giá khuyến mãi là số",
    ];
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    protected function methodPost(): array
    {
        return [
            'name' => ['required', 'string', 'min:10', 'max:255'],
            'short_description' => ['required', 'string', 'min:10', 'max:255'],
            'description' => ['required', 'string', 'min:50'],
            'status' => ['required', new EnumValue(ProductStatus::class)],
            'is_hot' => ['required'],
            'price' => ['nullable', 'numeric', 'max:10'],
            'promotion_price' => ['nullable', 'numeric', 'max:10'],
        ];
    }
}
