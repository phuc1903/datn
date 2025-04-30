@extends('layouts.mail')

@section('content')
    <tr>
        <td style="padding-top: 0;">
            <table width="560" align="center" cellpadding="0" cellspacing="0" border="0" class="devicewidthinner"
                style="border-bottom: 1px solid #bbbbbb;">
                <tbody>
                    <tr>
                        <td style="width: 55%; font-size: 16px; font-weight: bold; color: #666666; padding-bottom: 5px;">
                            Địa chỉ giao hàng
                        </td>
                        <td style="width: 45%; font-size: 16px; font-weight: bold; color: #666666; padding-bottom: 5px;">
                            Đơn hàng
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 55%; font-size: 14px; line-height: 18px; color: #666666;">
                            Người đặt: {{$order->full_name}}
                        </td>
                        <td style="width: 45%; font-size: 14px; line-height: 18px; color: #666666;">
                            Mã đơn hàng: {{ $order->id}}
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 55%; font-size: 14px; line-height: 18px; color: #666666;">
                            Địa chỉ giao: {{ $order->address}}
                        </td>
                        <td style="width: 45%; font-size: 14px; line-height: 18px; color: #666666;">
                            Ngày cập nhật: {{ $order->updated_at}}
                        </td>
                    </tr>
                </tbody>
            </table>
        </td>
    </tr>
    <div>
        <p style="font-size: 1.6rem; color: #ed0e69; text-align: center; margin-bottom: 16px;">{{ $status }}</p>
        @if(isset($reason))
            <span style="color: #252324; display: block; text-align: center; margin-bottom: 16px; font-size: 1rem;">Lý do: {{ $reason }}</span>
        @endif
        <div>
            <a href="{{ config('app.frontend_url')}}/order/{{$order->id}}" target="_blank" style="display: block; width: fit-content; padding: 10px 20px; background-color: #ed0e69; color: #ffffff; font-size: 1rem; margin: 0px auto; text-decoration: none; border-radius: 8px;">
                Xem chi tiết đơn hàng
            </a>
        </div>
    </div>
@endsection