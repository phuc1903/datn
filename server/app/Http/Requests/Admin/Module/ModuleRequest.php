<?php

namespace App\Http\Requests\Admin\Module;

use App\Enums\Module\ModuleStatus;
use App\Http\Requests\Admin\BaseRequest;
use BenSampo\Enum\Rules\EnumValue;

class ModuleRequest extends BaseRequest
{
    protected $customMessage = [
        'name.required' => 'Vui lòng nhập tên Module.',
        'name.string' => 'Tên Module phải là một chuỗi.',
        'name.max' => 'Tên Module không được vượt quá 255 ký tự.',
        'name.min' => 'Tên Module ít nhất 2 ký tự.',

        'description.required' => 'Vui lòng nhập mô tả.',
        'description.string' => 'Mô tả phải là chuỗi.',
        
        'status.required' => 'Vui lòng chọn trạng thái.',
        'status.enum' => 'Trạng thái không hợp lệ.',
    ];

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    protected function methodPost(): array
    {
        return [
            'name' => ['required', 'string', 'min:2', 'max:255'],
            'description' => ['required', 'string', 'min:5'],
            'status' => ['required', new EnumValue(ModuleStatus::class)],
        ];
    }

    protected function methodPut(): array
    {
        return [
            'name' => ['required', 'string', 'min:2', 'max:255'],
            'description' => ['required', 'string', 'min:5'],
            'status' => ['required', new EnumValue(ModuleStatus::class)],
        ];
    }

    // Chuyển đổi giá trị status thành kiểu int trước khi validation
    protected function prepareForValidation()
    {
        $this->merge([
            'status' => (int) $this->status,
        ]);
    }
}
