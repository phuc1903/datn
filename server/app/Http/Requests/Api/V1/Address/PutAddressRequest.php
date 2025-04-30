<?php

namespace App\Http\Requests\Api\V1\Address;

use App\Enums\User\UserAddress;
use Illuminate\Foundation\Http\FormRequest;

class PutAddressRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'address' => 'string|max:255',
            'phone_number' => 'numeric|digits_between:10,15', // Kiểm tra số điện thoại hợp lệ
            'default' => 'in:' . implode(',', UserAddress::getValues()),
            'name'=>'string|max:255',
        ];
    }
}
