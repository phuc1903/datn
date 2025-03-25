<?php

namespace App\Http\Requests\Admin\Order;

use App\Enums\Order\OrderStatus;
use App\Http\Requests\Admin\BaseRequest;
use BenSampo\Enum\Rules\EnumValue;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Support\Facades\Session;
use Illuminate\Http\Exceptions\HttpResponseException;


class OrderRequest extends BaseRequest
{
    protected $customMessage = [
        'reason.max' => 'Lý do không được vượt quá 255 ký tự.',
        'reason.min' => 'Lý do ít nhất phải 5 ký tự.',
        'reason.string' => 'Lý do phải là chuỗi.',
        'reason.required' => 'Hủy đơn cần nhập lý do.',
        
        'status.required' => 'Vui lòng chọn trạng thái',
    ];
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */

    protected function methodPut(): array
    {

        $this->validate =  [
            'status' => ['required', new EnumValue(OrderStatus::class)],
        ];

        if($this->input('status') === OrderStatus::Cancel) {
            $this->validate['reason'] = ['required','string', 'min:5', 'max:255'];
        }

        return $this->validate;

    }

    protected function failedValidation(Validator $validator) 
    {
        if($validator->errors()->has('reason')) {
            Session::flash('warning', $validator->errors()->first('reason'));
        }

        throw new HttpResponseException(
            redirect()->back()->withErrors($validator)->withInput()
        );
    }
}
