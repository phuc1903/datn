<?php

namespace App\Http\Requests\Admin\Category;

use App\Enums\Category\CategoryStatus;
use App\Http\Requests\Admin\BaseRequest;
use BenSampo\Enum\Rules\EnumValue;

class CategoryRequest extends BaseRequest
{
    protected $customMessage = [
        'name.required' => 'Vui lòng nhập tên.',
        'name.string' => 'Tên phải là một chuỗi.',
        'name.max' => 'Tên không được vượt quá 255 ký tự.',
        'name.min' => 'Tên ít nhất 2 ký tự',

        'short_description.required' => 'Vui lòng nhập mô tả.',
        'short_description.string' => 'Mô tả phải là một chuỗi.',
        'short_description.max' => 'Mô tả không được vượt quá 255 ký tự.',
        'short_description.min' => 'Mô tả ít nhất 10 ký tự',

        'image.image' => 'Hình chỉ được dạng: jpeg,png,jpg,gif,svg.',
        'image.mimes' => 'Hình chỉ được dạng: jpeg,png,jpg,gif,svg.',
        'image.max' => 'Kích thước tệp chỉ được 2048KB.',
        
        'slug.unique' => 'Slug không được trùng.',
        'slug.max' => 'Slug không được vượt quá 255 ký tự.',
        'slug.string' => 'Slug phải là chuỗi.',
        
        'status.required' => 'Vui lòng chọn giới tính',
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
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg', 'max:2048'],
            'slug' => ['nullable','string','max:255', 'unique:categories,slug'.$this->category],
            'status' => ['required', new EnumValue(CategoryStatus::class)],
        ];
    }

    protected function methodPut(): array
    {
        return [
            'name' => ['required', 'string', 'min:10', 'max:255'],
            'short_description' => ['required', 'string', 'min:10', 'max:255'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg', 'max:2048'],
            'slug' => ['nullable','string','max:255', 'unique:categories,slug,'.$this->category],
            'status' => ['required', new EnumValue(CategoryStatus::class)],
        ];
    }
}
