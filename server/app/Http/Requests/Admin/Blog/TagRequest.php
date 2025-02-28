<?php

namespace App\Http\Requests\Admin\Blog;

use App\Http\Requests\Admin\BaseRequest;

class TagRequest extends BaseRequest
{
    protected $customMessage = [
        'name.required' => 'Vui lòng nhập Tên danh mục.',
        'name.string' => 'Tên danh mục phải là một chuỗi.',
        'name.max' => 'Tên danh mục không được vượt quá 60 ký tự.',
        'name.min' => 'Tên danh mục ít nhất 5 ký tự',
        'name.unique' => 'Tên danh mục đã bị trùng',
    ];
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    protected function methodPost(): array
    {
        return [
            'name' => ['required', 'string', 'min:5', 'max:60', 'unique:tags,name'.$this->tag],
        ];
    }

    protected function methodPut(): array
    {
        return [
            'name' => ['required', 'string', 'min:5', 'max:60', 'unique:tags,name,'.$this->route('tag')->id.',id'],
        ];
    }
}
