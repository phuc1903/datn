<?php

namespace App\Http\Requests\Api\V1\Cart\CartController;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;

class UpdateCartRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
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
