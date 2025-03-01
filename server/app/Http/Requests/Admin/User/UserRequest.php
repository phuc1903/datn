<?php

namespace App\Http\Requests\Admin\User;

use App\Enums\User\UserSex;
use App\Http\Requests\Admin\BaseRequest;
use BenSampo\Enum\Rules\EnumValue;

class UserRequest extends BaseRequest
{
//     protected function getRegexPassword()
// {
//     return 'regex:/^(0[3-9]{1}[0-9]{8}|(84)[3-9]{1}[0-9]{8})$/';
// }

    protected $customMessage = [
        'first_name.required' => 'Vui lòng nhập tên.',
        'first_name.string' => 'Tên phải là một chuỗi.',
        'first_name.max' => 'Tên không được vượt quá 255 ký tự.',
        'first_name.min' => 'Tên ít nhất 10 ký tự',
        'last_name.required' => 'Vui lòng nhập họ.',
        'last_name.string' => 'Họ phải là một chuỗi.',
        'last_name.max' => 'Họ không được vượt quá 255 ký tự.',
        'last_name.min' => 'Họ ít nhất 10 ký tự',
        'phone_number.required' => 'Vui lòng nhập Số điện thoại.',
        'phone_number.regex' => 'Vui lòng nhập đúng định dạng SĐT.',
        'email.required' => 'Vui lòng nhập email.',
        'email.email' => 'Vui lòng nhập đúng định dạng email',
        'email.string' => 'Email ngắn phải là một chuỗi.',
        'password.required' => 'Vui lòng nhập mật khẩu.',
        'password.max' => 'Mật khẩu không được vượt quá 255 ký tự.',
        'password.min' => 'Mật khẩu ít nhất 5 ký tự.',
        'password.string' => 'Mật khẩu phải là một chuỗi.',
        'password.confirmed' => 'Xác nhận mật khẩu không đúng.',
        'sex.required' => 'Vui lòng chọn giới tính',
        'addresses.*.city.string' => "Vui lòng nhập Tỉnh/Thành Phố là chuỗi",
        'addresses.*.city.max' => "Tỉnh/Thành Phố không được vượt quá 255 ký tự",
        'addresses.*.district.string' => "Vui lòng nhập Quận/Huyện Phố là chuỗi",
        'addresses.*.district.max' => "Quận/Huyện Phố không được vượt quá 255 ký tự",
        'addresses.*.ward.string' => "Vui lòng nhập Phường/Xã Phố là chuỗi",
        'addresses.*.ward.max' => "Phường/Xã Phố không được vượt quá 255 ký tự",
    ];
    // public function methodGet()
    // {
    //     return [
    //         'id' => ['required', 'exists:App\Models\Product,id'],
    //     ];
    // }
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    protected function methodPost(): array
    {
        return [
            'first_name' => ['required', 'string', 'min:10', 'max:255'],
            'last_name' => ['required', 'string', 'min:10', 'max:2255'],
            'phone_number' => ['required'],
            'email' => ['required', 'email'],
            'password' => ['required','min:5', 'max:255', 'confirmed', 'string'],
            'sex' => ['required', new EnumValue(UserSex::class)],
        ];
    }

    protected function methodPut():array
    {
        return [
            'first_name' => ['required', 'string', 'min:10', 'max:255'],
            'last_name' => ['required', 'string', 'min:10', 'max:2255'],
            'phone_number' => ['required', 'numeric'],
            'email' => ['required', 'email'],
            'password' => ['required','min:5', 'max:255', 'confirmed', 'string'],
            'sex' => ['required', new EnumValue(UserSex::class)],
            'addresses.*.city'     => ['nullable','string','max:255'],
            'addresses.*.district' => ['nullable','string','max:255'],
            'addresses.*.ward'     => ['nullable','string','max:255'],
            'addresses.*.address'  => ['nullable','string','max:255'],
        ];
    }
}
