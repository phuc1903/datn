<?php

namespace App\Http\Requests\Api\V1\Cart\CartController;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;

class AddCartRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'sku_id' => 'required_without:sku_code|max:255',
            'sku_code' => 'required_without:sku_id|max:255',
            'quantity' => 'required|integer|min:1',
        ];
    }

    public function messages()
    {
        return [
            // Custom here
        ];
    }

    public function attributes()
    {
        return [
            // Custom here
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
