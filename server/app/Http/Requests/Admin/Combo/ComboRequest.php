<?php

namespace App\Http\Requests\Admin\Combo;

use App\Enums\Blog\BlogStatus;
use App\Http\Requests\Admin\BaseRequest;
use BenSampo\Enum\Rules\EnumValue;

class ComboRequest extends BaseRequest
{
    protected $customMessage = [
        'title.required' => 'Vui lòng nhập Tiêu đề.',
        'title.string' => 'Tiêu đề phải là một chuỗi.',
        'title.max' => 'Tiêu đề không được vượt quá 255 ký tự.',
        'title.min' => 'Tiêu đề ít nhất 10 ký tự',

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
    ];
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    protected function methodPost(): array
    {
        return [
            'title' => ['required', 'string', 'min:10', 'max:255'],
            'slug' => ['nullable', 'string'],
            'short_description' => ['required', 'string', 'min:10', 'max:500'],
            'description' => ['required', 'string', 'min:20'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg', 'max:2048'],
            'status' => ['required', new EnumValue(BlogStatus::class)],
        ];
    }

    protected function methodPut(): array
    {
        return [
            'title' => ['required', 'string', 'min:10', 'max:255'],
            'slug' => ['nullable', 'string'],
            'short_description' => ['required', 'string', 'min:10', 'max:500'],
            'description' => ['required', 'string', 'min:20'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg', 'max:2048'],
            'status' => ['required', new EnumValue(BlogStatus::class)],
        ];
    }
}
