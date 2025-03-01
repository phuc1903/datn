@extends('layouts.app')

@section('content')
    <form id="update-order-form" action="{{ route('admin.order.store') }}" method="POST">
        @csrf
        <div class="row card-custom">
            <div class="col-9">
                <div class="card mb-3">
                    <div class="card-header">
                        <h3 class="title">Thông tin đơn hàng</h3>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-6">
                                <h5>Thông tin chung</h5>
                                <div class="form-floating gap-3">
                                    <textarea class="form-control" name="reason" placeholder="Leave a comment here" id="floatingTextarea"></textarea>
                                    <label for="floatingTextarea">Lý do</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <h5>Thông tin giao hàng</h5>
                                <x-form.input_text label="Họ và tên" value="" name="full_name" />
                                <x-form.input_text label="Email" value="" name="email" />
                                <x-form.input_text label="Số điện thoại" value=""
                                    name="phone_number" />
                                <x-form.input_text label="Địa chỉ" value="" name="address" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header">
                        <h3 class="title">Sản phẩm trong đơn hàng</h3>
                        <x-button.index type="button" label="Thêm sản phẩm" data-bs-toggle="modal" data-bs-target="#addProduct" />
                        @include('Pages.Order.Component.modal_add_product', ['id' => "addProduct", 'data' => $products])
                    </div>
                    <div class="card-body">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col" class="text-center">STT</th>
                                    <th scope="col" class="text-center">Tên sản phẩm</th>
                                    <th scope="col" class="text-center">Giá</th>
                                    <th scope="col" class="text-center">Số lượng</th>
                                    <th scope="col" class="text-center">Tổng tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="col-3">
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
                        <select class="form-select selec-custom" aria-label="Default select example" name="status">
                            <x-form.select.option :options="$status" />
                        </select>
                    </div>
                </div>
                <div class="card mb-3">
                    <div class="card-header">
                        <h5 class="title">Phương thức thanh toán</h5>
                    </div>
                    <div class="card-body">
                        <select class="form-select selec-custom" aria-label="Default select example" name="payment_method">
                            <x-form.select.option :options="$paymentMethod" />
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </form>
@endsection
