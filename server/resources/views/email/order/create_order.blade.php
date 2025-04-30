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
                            Người đặt: {{ $order->full_name }}
                        </td>
                        <td style="width: 45%; font-size: 14px; line-height: 18px; color: #666666;">
                            Mã đơn hàng: {{ $order->id }}
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 55%; font-size: 14px; line-height: 18px; color: #666666;">
                            Địa chỉ giao: {{ $order->address }}
                        </td>
                        <td style="width: 45%; font-size: 14px; line-height: 18px; color: #666666;">
                            Ngày cập nhật: {{ $order->updated_at }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </td>
    </tr>

    <!-- Load các sản phẩm ở đây -->
    @foreach ($order->items as $item)
        <tr>
            <td style="padding-top: 0;">
                <table width="560" align="center" cellpadding="0" cellspacing="0" border="0" class="devicewidthinner"
                    style="border-bottom: 1px solid #bbbbbb;">
                    <tbody>
                        <tr>
                            <td colspan="2"
                                style="font-size: 14px; font-weight: bold; color: #666666; padding-bottom: 5px;">
                                {{ $item->sku->product->name }}
                            </td>
                        </tr>
                        <tr>
                            <td style="font-size: 14px; line-height: 18px; color: #757575; width: 440px;">
                                Số lượng: <span style="font-weight: bold;">{{ $item->quantity }}</span>
                            </td>
                            <td style="width: 130px;"></td>
                        </tr>
                        <tr>
                            <td style="font-size: 14px; line-height: 18px; color: #757575; width: 440px;">
                                Giá: <span style="font-weight: bold;">
                                    @if ($item->sku->promotion_price > 0)
                                        {{ number_format($item->sku->promotion_price) }} VNĐ
                                        <span style="font-size: 12px; color: #666666; font-weight: normal;">
                                            <del>({{ number_format($item->sku->price) }} VNĐ)</del>
                                        </span>
                                    @else
                                        {{ number_format($item->sku->price) }} VNĐ
                                    @endif
                                </span>
                            </td>
                            <td style="width: 130px;"></td>
                        </tr>
                        <tr>
                            <td style="font-size: 14px; line-height: 18px; color: #757575; padding-bottom: 10px;">
                                @if ($item->sku->variantValues->count() > 0)
                                    @foreach ($item->sku->variantValues as $variantValue)
                                        {{ $variantValue->variant->name }}: {{ $variantValue->value }}
                                    @endforeach
                                @endif
                            </td>
                            <td
                                style="font-size: 14px; line-height: 18px; color: #757575; text-align: right; padding-bottom: 10px;">
                                <b style="color: #666666;">
                                    @if (isset($item->sku->promotion_price) && $item->sku->promotion_price > 0)
                                        {{ number_format($item->sku->promotion_price * $item->quantity) }}
                                    @else
                                        {{ number_format($item->sku->price * $item->quantity) }}
                                    @endif
                                    VNĐ
                                </b>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    @endforeach

    {{-- Thông tin đơn hàng  --}}
    <tr>
        <td style="padding-top: 0;">
            <table width="560" align="center" cellpadding="0" cellspacing="0" border="0" class="devicewidthinner"
                style="border-bottom: 1px solid #bbbbbb; margin-top: -5px;">
                <tbody>
                    <tr>
                        <td
                            style="font-size: 14px; font-weight: bold; line-height: 18px; color: #666666; padding-bottom: 10px;">
                            Tổng thanh toán
                        </td>
                        <td
                            style="font-size: 14px; font-weight: bold; line-height: 18px; color: #666666; text-align: right; padding-bottom: 10px;">
                            {{ number_format($order->total_amount) }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </td>
    </tr>
@endsection
