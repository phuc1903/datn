<?php

namespace App\Http\Requests\Api\V1\Address;

use App\Enums\Order\OrderPaymentMethod;
use App\Enums\User\UserAddress;
use Illuminate\Foundation\Http\FormRequest;

class AddAddressRequest extends FormRequest
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
            'address' => 'required|string|max:255',
            'phone_number' => 'required|numeric|digits_between:10,15', // Kiểm tra số điện thoại hợp lệ
            'default' => 'required|in:' . implode(',', UserAddress::getValues()),
            'name'=>'required|string|max:255',
        ];
    }
}
