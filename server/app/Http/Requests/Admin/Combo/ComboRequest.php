<?php

namespace App\Http\Requests\Admin\Combo;

use App\Enums\Combo\ComboStatus;
use App\Http\Requests\Admin\BaseRequest;
use BenSampo\Enum\Rules\EnumValue;

class ComboRequest extends BaseRequest
{
    protected $customMessage = [
        'name.required' => 'Vui lòng nhập Tên combo.',
        'name.string' => 'Tên combo phải là một chuỗi.',
        'name.max' => 'Tên combo không được vượt quá 255 ký tự.',
        'name.min' => 'Tên combo ít nhất 10 ký tự',

        'short_description.required' => 'Vui lòng nhập Mô tả ngắn.',
        'short_description.string' => 'Mô tả ngắn phải là một chuỗi.',
        'short_description.max' => 'Mô tả ngắn không được vượt quá 500 ký tự.',
        'short_description.min' => 'Mô tả ngắn ít nhất 10 ký tự',

        'description.required' => 'Vui lòng nhập Mô tả.',
        'description.string' => 'Mô tả phải là một chuỗi.',
        'description.min' => 'Mô tả ít nhất 20 ký tự',

        'image_url.image' => 'Hình chỉ được dạng: jpeg,png,jpg,gif,svg.',
        'image_url.mimes' => 'Hình chỉ được dạng: jpeg,png,jpg,gif,svg.',
        'image_url.max' => 'Kích thước tệp chỉ được 10000KB.',

        'slug.string' => 'Slug phải là chuỗi',

        'status.required' => 'Vui lòng chọn trạng thái',
        'is_hot.required' => "Vui lòng chọn độ hot của combo",

        'quantity.required' => "Vui lòng nhập số lượng",
        'quantity.numeric' => "Số lượng phải là số",
        'quantity.max' => "Số lượng chỉ được dưới 1000",

        'price.required' => "Vui lòng nhập giá",
        'price.numeric' => "Giá phải là số",
        'price.max' => "Giá tối đa là 999.999.999 VNĐ",

        'promotion_price.required' => "Vui lòng nhập giá khuyến mãi",
        'promotion_price.numeric' => "Giá khuyến mãi phải là số",
        'promotion_price.max' => "Giá khuyến mãi tối đa là 999.999.999 VNĐ",

        'date_start.required' => 'Ngày bắt đầu là bắt buộc.',
        'date_start.date' => 'Ngày bắt đầu phải có định dạng ngày hợp lệ.',
        'date_start.before' => 'Ngày bắt đầu phải trước ngày kết thúc.',

        'date_end.required' => 'Ngày kết thúc là bắt buộc.',
        'date_end.date' => 'Ngày kết thúc phải có định dạng ngày hợp lệ.',
        'date_end.after' => 'Ngày kết thúc phải sau ngày bắt đầu.',

        'skus.required' => "Vui lòng chọn sản phẩm",
        'skus.array' => "Sản phẩm phải là mảng",
        'skus.min' => "Chọn ít nhất 2 sản phẩm",
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
            'slug' => ['nullable', 'string'],
            'short_description' => ['required', 'string', 'min:10', 'max:500'],
            'description' => ['required', 'string', 'min:20'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg', 'max:2048'],
            'status' => ['required', new EnumValue(ComboStatus::class)],
            'is_hot' => ['required'],
            'quantity' => ['required', 'numeric', 'max:100'],
            'price' => ['required', 'numeric', 'max:999999999'],
            'promotion_price' => ['required', 'numeric', 'max:999999999'],
            'date_start' => ['required', 'date', 'before:date_end'],
            'date_end' => ['required', 'date', 'after:date_start'],
            'skus' => ['required', 'array', 'min:1'],
        ];
    }

    protected function methodPut(): array
    {
        return [
            'name' => ['required', 'string', 'min:10', 'max:255'],
            'slug' => ['nullable', 'string'],
            'short_description' => ['required', 'string', 'min:10', 'max:500'],
            'description' => ['required', 'string', 'min:20'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg', 'max:2048'],
            'status' => ['required', new EnumValue(ComboStatus::class)],
            'is_hot' => ['required'],
            'quantity' => ['required', 'numeric', 'max:100'],
            'price' => ['required', 'numeric', 'max:999999999'],
            'promotion_price' => ['required', 'numeric', 'max:999999999'],
            'date_start' => ['required', 'date', 'before_or_equal:date_end'],
            'date_end' => ['required', 'date', 'after_or_equal:date_start'],
            'skus' => ['required', 'array', 'min:1'],
        ];
    }
}
