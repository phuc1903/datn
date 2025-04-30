<?php

namespace App\Http\Requests\Admin\Permission;

use App\Http\Requests\Admin\BaseRequest;
use Illuminate\Validation\Rule;

class PermissionRequest extends BaseRequest
{
    protected $customMessage = [
        'title.required' => 'Vui lòng nhập tên.',
        'title.string' => 'Tên phải là một chuỗi.',
        'title.max' => 'Tên không được vượt quá 255 ký tự.',
        'title.min' => 'Tên ít nhất 2 ký tự.',
        
        'name.required' => 'Vui lòng nhập tên.',
        'name.string' => 'Tên phải là một chuỗi.',
        'name.max' => 'Tên không được vượt quá 255 ký tự.',
        'name.min' => 'Tên ít nhất 2 ký tự.',
        'name.unique' => 'Tên đã bị trùng.',

        'guard_name.required' => 'Vui lòng chọn guard name.',
        'module_id.required' => 'Vui lòng chọn module.',
    ];

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    protected function methodPost(): array
    {
        return [
            'title' => ['required', 'string', 'min:2', 'max:255', 'unique:permissions,name'.$this->permission],
            'name' => ['required', 'string', 'min:2', 'max:255'],
            'guard_name' => ['required', 'string'],
            'module_id' => ['required'],
        ];
    }

    protected function methodPut(): array
    {
        return [
            'title' => ['required', 'string', 'min:2', 'max:255'],
            'name' => ['required', 'string', 'min:2', 'max:255', Rule::unique('permissions', 'name')->ignore($this->route('permission'))],
            'guard_name' => ['required', 'string'],
            'module_id' => ['required'],
        ];
    }
}
