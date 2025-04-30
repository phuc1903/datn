<?php

namespace App\Http\Requests\Api\V1\Order;

use App\Enums\Order\OrderPaymentMethod;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;

class CreateOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'address' => 'required|string|max:255',
            'phone_number' => 'required|numeric|digits_between:10,15', // Kiểm tra số điện thoại hợp lệ
            'payment_method' => 'required|in:' . implode(',', OrderPaymentMethod::getValues()),
            'note' => 'nullable|string|max:255',
            'voucher_id' => 'nullable|numeric',
            'orders' => 'required|array|min:1',
            'orders.*.quantity' => 'required|integer|min:1',
        ];
    }

    public function messages()
    {
        return [
            'required' => ':attribute không được để trống.',
            'string' => ':attribute phải là một chuỗi ký tự.',
            'numeric' => ':attribute phải là một số.',
            'integer' => ':attribute phải là một số nguyên.',
            'max' => ':attribute không được vượt quá :max ký tự.',
            'min' => ':attribute không được vượt quá :min ký tự.',
            'digits_between' => ':attribute phải có từ :min đến :max chữ số.',
            'in' => ':attribute phải là một giá trị hợp lệ: :values.',
            'nullable' => ':attribute là tùy chọn.',
        ];
    }

    public function attributes()
    {
        return [
            'address' => 'Địa chỉ',
            'phone_number' => 'Số điện thoại',
            'payment_method' => 'Phương thức thanh toán',
            'note' => 'Ghi chú',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new ValidationException(
            $validator,
            ResponseError('Validation error', $validator->errors(), 400)
        );
    }
}
