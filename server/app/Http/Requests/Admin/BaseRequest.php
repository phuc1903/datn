<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class BaseRequest extends FormRequest
{
    protected $validate = [];
    protected $customMessage = [];

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
        $method = strtoupper($this->method());

        switch ($method) {
            case 'GET':
                $this->validate = $this->methodGet();
                break;
            case 'POST':
                $this->validate = $this->methodPost();
                break;
            case 'PUT':
                $this->validate = $this->methodPut();
                break;
            case 'DELETE':
                $this->validate = $this->methodDelete();
                break;
            case 'PATH':
                $this->validate = $this->methodPath();
                break;
            default:
                $this->validate = [];
                break;
        }

        return $this->validate;
    }

    /**
     * Customize the validation error messages.
     *
     * @return array
     */
    public function messages(): array
    {
        return $this->customMessage;
    }

    /**
     * Get the validation rules that apply to the request (for GET).
     *
     * @return array
     */
    protected function methodGet(): array
    {
        return [];
    }

    /**
     * Get the validation rules that apply to the request (for POST).
     *
     * @return array
     */
    protected function methodPost(): array
    {
        return [];
    }

    /**
     * Get the validation rules that apply to the request (for PUT).
     *
     * @return array
     */
    protected function methodPut(): array
    {
        return [];
    }

    /**
     * Get the validation rules that apply to the request (for DELETE).
     *
     * @return array
     */
    protected function methodDelete(): array
    {
        return [];
    }

    /**
     * Get the validation rules that apply to the request (for PATH).
     *
     * @return array
     */
    protected function methodPath(): array
    {
        return [];
    }

    /**
     * Get the validation rules that apply to the request (for OPTION).
     *
     * @return array
     */
    protected function methodOptions(): array
    {
        return [];
    }

}
