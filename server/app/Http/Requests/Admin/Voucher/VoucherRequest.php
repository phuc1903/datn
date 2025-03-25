<?php

namespace App\Http\Requests\Admin\Voucher;

use App\Enums\Voucher\VoucherStatus;
use App\Enums\Voucher\VoucherType;
use App\Http\Requests\Admin\BaseRequest;
use BenSampo\Enum\Rules\EnumValue;

class VoucherRequest extends BaseRequest
{
    protected $customMessage = [
        'title.required' => "Vui lòng nhập tên voucher",
        'title.string' => "Tên voucher phải là chuỗi",
        'title.min' => "Tên voucher ít nhất 5 ký tự",
        'title.max' => "Tên voucher nhiều nhất 60 ký tự",
        'quantity.required' => 'Vui lòng nhập số lượng voucher',
        'quantity.numeric' => 'Số lượng voucher phải là số',
        'type' => 'Vui lòng chọn loại voucher',
        'status' => 'Vui lòng chọn trạng thái voucher',
        'discount_value.required' => 'Vui lòng nhập giá trị được giảm',
        'discount_value.numeric' => 'Giá trị được giảm phải là số',
        'max_discount_value.numeric' => "Giá trị được giảm tối đa phải là số",
        'min_order_value.required' => 'Vui lòng nhập giá trị tối thiểu của đơn hàng',
        'min_order_value.numeric' => 'Giá trị tối thiểu của đơn hàng phải là số',
        'started_date' => 'Vui lòng chọn ngày bắt đầu',
        'ended_date' => 'Vui lòng chọn ngày kết thúc',
        'description.required' => 'Vui lòng nhập mô tả',
        'description.string' => 'Mô tả phải là chuỗi',
        'description.min' => 'Mô tả ít nhất phải 5 ký tự',
        'description.max' => 'Mô tả nhiều nhất 500 ký tự',
    ];
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    protected function methodPost(): array
    {
        return [
            'title' => ['required', 'string', 'min:5', 'max:60'],
            'quantity' => ['required', 'numeric'],
            'type' => ['required', new EnumValue(VoucherType::class)],
            'status' => ['required', new EnumValue(VoucherStatus::class)],
            'discount_value' => ['required', 'numeric'],
            'max_discount_value' => ['nullable', 'numeric'],
            'min_order_value' => ['required', 'numeric'],
            'started_date' => ['required'],
            'ended_date' => ['required'],
            'description' => ['required', 'string', 'min:5', 'max:255'],
        ];
    }

    protected function methodPut(): array
    {
        return [
            'title' => ['required', 'string', 'min:5', 'max:60'],
            'quantity' => ['required', 'numeric'],
            'type' => ['required', new EnumValue(VoucherType::class)],
            'status' => ['required', new EnumValue(VoucherStatus::class)],
            'discount_value' => ['required', 'numeric'],
            'max_discount_value' => ['nullable', 'numeric'],
            'min_order_value' => ['required', 'numeric'],
            'started_date' => ['required'],
            'ended_date' => ['required'],
            'description' => ['required', 'string', 'min:5', 'max:500'],
        ];
    }
}
