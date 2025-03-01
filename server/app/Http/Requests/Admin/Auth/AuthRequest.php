<?php

namespace App\Http\Requests\Admin\Auth;

use App\Http\Requests\Admin\BaseRequest;

class AuthRequest extends BaseRequest
{
    protected $customMessage = [
        'email.required' => 'Vui lòng nhập email.',
        'email.email' => 'Vui lòng nhập đúng định dạng email',
        'email.string' => 'Email ngắn phải là một chuỗi.',

        'password.required' => 'Vui lòng nhập mật khẩu.',
        'password.max' => 'Mật khẩu không được vượt quá 255 ký tự.',
        'password.min' => 'Mật khẩu ít nhất 5 ký tự.',
        'password.string' => 'Mật khẩu phải là một chuỗi.',
    ];

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    protected function methodPost(): array
    {
        return [
            'email' => ['required', 'email'],
            'password' => ['required', 'min:5', 'max:255', 'string'],
        ];
    }

}
