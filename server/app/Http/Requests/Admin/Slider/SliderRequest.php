<?php

namespace App\Http\Requests\Admin\Slider;

use App\Enums\Slide\SlideStatus;
use App\Http\Requests\Admin\BaseRequest;
use BenSampo\Enum\Rules\EnumValue;
use Illuminate\Foundation\Http\FormRequest;

class SliderRequest extends BaseRequest
{
    protected $customMessage = [
        'name.required' => 'Vui lòng nhập tên.',
        'name.string' => 'Tên phải là một chuỗi.',
        'name.max' => 'Tên không được vượt quá 255 ký tự.',
        'name.min' => 'Tên ít nhất 2 ký tự',

        'priority.required' => 'Vui lòng nhập độ ưu tiên.',
        'priority.numeric' => 'Độ ưu tiên phải là một chuỗi.',

        'image.image' => 'Hình chỉ được dạng: jpeg,png,jpg,gif,svg.',
        'image.mimes' => 'Hình chỉ được dạng: jpeg,png,jpg,gif,svg.',
        'image.max' => 'Kích thước tệp chỉ được 10000KB.',

        'status.required' => 'Vui lòng chọn trạng thái',
    ];
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    protected function methodPost(): array
    {
        return [
            'name' => ['required', 'string', 'min:10', 'max:255'],
            'priority' => ['required', 'numeric'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg', 'max:2048'],
            'status' => ['required', new EnumValue(SlideStatus::class)],
        ];
    }

    protected function methodPut(): array
    {
        return [
            'name' => ['required', 'string', 'min:10', 'max:255'],
            'priority' => ['required', 'numeric'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg', 'max:2048'],
            'status' => ['required', new EnumValue(SlideStatus::class)],
        ];
    }
}
