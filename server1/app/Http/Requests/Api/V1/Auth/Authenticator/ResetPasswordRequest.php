<?php

namespace App\Http\Requests\Api\V1\Auth\Authenticator;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;

class ResetPasswordRequest extends FormRequest
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
            'email' => 'required|email|max:255',
            'token' => 'required',
            'password' => 'required|max:255',
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
