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

    <!-- Load các sản phẩm ở đây -->
    <tr>
        <td style="padding-top: 0;">
            <table width="560" align="center" cellpadding="0" cellspacing="0" border="0" class="devicewidthinner"
                style="border-bottom: 1px solid #eeeeee;">
                <tbody>
                    <tr>
                        <td rowspan="4" style="padding-right: 10px; padding-bottom: 10px;">
                            <img style="height: 80px;" src="images/product-1.jpg" alt="Product Image" />
                        </td>
                        <td colspan="2" style="font-size: 14px; font-weight: bold; color: #666666; padding-bottom: 5px;">
                            Lorem ipsum dolor sit amet
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 14px; line-height: 18px; color: #757575; width: 440px;">
                            Quantity: 100
                        </td>
                        <td style="width: 130px;"></td>
                    </tr>
                    <tr>
                        <td style="font-size: 14px; line-height: 18px; color: #757575;">
                            Color: White & Blue
                        </td>
                        <td style="font-size: 14px; line-height: 18px; color: #757575; text-align: right;">
                            $1.23 Per Unit
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 14px; line-height: 18px; color: #757575; padding-bottom: 10px;">
                            Size: XL
                        </td>
                        <td
                            style="font-size: 14px; line-height: 18px; color: #757575; text-align: right; padding-bottom: 10px;">
                            <b style="color: #666666;">$1,234.50</b> Total
                        </td>
                    </tr>
                </tbody>
            </table>
        </td>
    </tr>
   
    {{-- Thông tin đơn hàng  --}}
    <tr>
        <td style="padding-top: 0;">
            <table width="560" align="center" cellpadding="0" cellspacing="0" border="0" class="devicewidthinner"
                style="border-bottom: 1px solid #bbbbbb; margin-top: -5px;">
                <tbody>
                    <tr>
                        <td rowspan="5" style="width: 55%;"></td>
                        <td style="font-size: 14px; line-height: 18px; color: #666666;">
                            Sub-Total:
                        </td>
                        <td style="font-size: 14px; line-height: 18px; color: #666666; width: 130px; text-align: right;">
                            $1,234.50
                        </td>
                    </tr>
                    <tr>
                        <td
                            style="font-size: 14px; line-height: 18px; color: #666666; padding-bottom: 10px; border-bottom: 1px solid #eeeeee;">
                            Shipping Fee:
                        </td>
                        <td
                            style="font-size: 14px; line-height: 18px; color: #666666; padding-bottom: 10px; border-bottom: 1px solid #eeeeee; text-align: right;">
                            $10.20
                        </td>
                    </tr>
                    <tr>
                        <td
                            style="font-size: 14px; font-weight: bold; line-height: 18px; color: #666666; padding-top: 10px;">
                            Order Total
                        </td>
                        <td
                            style="font-size: 14px; font-weight: bold; line-height: 18px; color: #666666; padding-top: 10px; text-align: right;">
                            $1,234.50
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 14px; font-weight: bold; line-height: 18px; color: #666666;">
                            Payment Term:
                        </td>
                        <td
                            style="font-size: 14px; font-weight: bold; line-height: 18px; color: #666666; text-align: right;">
                            100%
                        </td>
                    </tr>
                    <tr>
                        <td
                            style="font-size: 14px; font-weight: bold; line-height: 18px; color: #666666; padding-bottom: 10px;">
                            Deposit Amount
                        </td>
                        <td
                            style="font-size: 14px; font-weight: bold; line-height: 18px; color: #666666; text-align: right; padding-bottom: 10px;">
                            $1,234.50
                        </td>
                    </tr>
                </tbody>
            </table>
        </td>
    </tr>
@endsection