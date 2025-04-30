<?php

namespace App\Http\Requests\Api\V1\Product;

use Illuminate\Foundation\Http\FormRequest;

class CreateCommentRequest extends FormRequest
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
            'product_id' => 'required|exists:products,id',
            'comment' => 'required|string|max:1000',
            'anonymous' => 'nullable',
            'parents_id' => 'nullable|exists:product_comments,id',
        ];
    }
    public function messages(): array
    {
        return [
            'product_id.required' => 'Vui lòng chọn sản phẩm.',
            'product_id.exists' => 'Sản phẩm không tồn tại.',
            'comment.required' => 'Nội dung bình luận không được để trống.',
            'comment.max' => 'Nội dung bình luận không được vượt quá 1000 ký tự.',
            'anonymous.boolean' => 'Trạng thái ẩn danh không hợp lệ.',
            'parents_id.exists' => 'Bình luận cha không tồn tại.',
        ];
    }
}
