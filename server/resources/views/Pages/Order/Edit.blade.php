@extends('layouts.app')

@section('content')
    <form id="update-order-form" action="{{ route('admin.order.update', $order) }}" method="POST">
        @csrf
        @method('PUT')
        <div class="row card-custom">
            <div class="col-12 col-md-9">
                <div class="card mb-3">
                    <div class="card-header">
                        <h3 class="title">Thông tin đơn hàng</h3>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-12 col-md-6">
                                <h5 class="mb-3">Thông tin chung</h5>
                                <div class="mb-3">
                                    <label for="note" class="form-label">Ghi chú đơn hàng của khách hàng</label>
                                    <textarea class="form-control" name="note" disabled id="note" rows="3">{{ $order->note }}</textarea>
                                  </div>
                                <div class="mb-3">
                                    <label for="reason" class="form-label">Lý do hủy đơn</label>
                                    <textarea class="form-control @error('reason')  @endError" @if($checkStatus || $checkStatusSuccess) disabled @endif name="reason" id="reason" rows="3">{{ $order->reason }}</textarea>
                                </div>
                            </div>
                            <div class="col-12 col-md-6">
                                <h5 class="mb-3">Thông tin giao hàng</h5>
                                <x-form.input_text label="Họ và tên" value="{{ $order->full_name }}" name="full_name"
                                    disabled />
                                <x-form.input_text label="Email" value="{{ $order->email }}" name="email" disabled />
                                <x-form.input_text label="Số điện thoại" value="{{ $order->phone_number }}"
                                    name="phone_number" disabled />
                                <x-form.input_text label="Địa chỉ" disabled value="{{ $order->address }}" name="address" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header">
                        <h3 class="title">Sản phẩm trong đơn hàng</h3>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col" class="text-center text-dark-custom">STT</th>
                                        <th scope="col" class="text-center text-dark-custom">Tên sản phẩm</th>
                                        <th scope="col" class="text-center text-dark-custom">Loại</th>
                                        <th scope="col" class="text-center text-dark-custom">Giá</th>
                                        <th scope="col" class="text-center text-dark-custom">Số lượng</th>
                                        <th scope="col" class="text-center text-dark-custom">Tổng tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach ($order->items as $index => $item)
                                        @php
                                            $variantValues = $item->sku->variantValues->pluck('value')->implode(' - ');
                                        @endphp
                                        <tr>
                                            <th scope="row" class="text-center text-dark-custom">{{ $index + 1 }}</th>
                                            <td class="text-center text-dark-custom">
                                                {{ $item->sku->product->name }}</td>
                                            <td class="text-center text-dark-custom">
                                                {{ $variantValues }}</td>
                                            <td class="text-center text-dark-custom" style="width: 200px;">
                                                {{ number_format($item->price, 2, '.', '.') }} VNĐ</td>
                                            <td class="text-center text-dark-custom" style="width: 100px;">
                                                {{ $item->quantity }}</td>
                                            <td class="text-center text-dark-custom" style="width: 200px;">
                                                {{ number_format($item->quantity * $item->price, 2, '.', '.') }} VNĐ</td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-3">
                <div class="card mb-3">
                    <div class="card-header">
                        <h5 class="title">Đăng</h5>
                    </div>
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <x-button.index type="submit" label="Cập nhật" />
                        </div>
                    </div>
                </div>
                <div class="card mb-3">
                    <div class="card-header">
                        <h5 class="title">Trạng thái đơn hàng</h5>
                    </div>
                    <div class="card-body">
                        <select class="form-select selec-custom" id="statusOrder" aria-label="Default select example"
                            name="status">
                            <option value="{{ $statusActiveValue }}" selected>{{ $statusActive }}</option>
                            <x-form.select.option :options="$statusList" />
                        </select>
                    </div>
                </div>
                <div class="card mb-3">
                    <div class="card-header">
                        <h5 class="title">Phương thức thanh toán</h5>
                    </div>
                    <div class="card-body">
                        <x-form.input_text disabled value="{{ $paymentActive }}" name="address" />
                    </div>
                </div>
            </div>
        </div>

    </form>
@endsection
