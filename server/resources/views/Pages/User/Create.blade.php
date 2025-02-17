@extends('layouts.app')

@section('content')
    <form action="{{ route('admin.user.store') }}" method="post">
        @csrf
        <div class="row card-custom">
            <div class="col-9">
                <div class="row">
                    <div class="col-5 mb-3">
                        <div class="card">
                            <div class="card-header">
                                <h4 class="title">Thông tin chính</h4>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <x-form.input_text label="Họ" name="last_name" />
                                    <x-form.input_text label="Tên" name="first_name" />
                                    <x-form.input_text label="Email" name="email" type="email" />
                                    <x-form.input_text label="Số điện thoại" name="phone_number" />
                                    <x-form.input_text label="Mật khẩu" name="password" type="password" />
                                    <x-form.input_text label="Xác nhận mật khẩu" name="password_confirm" type="password" />
                                    <div class="mb-3">
                                        <label for="sex" class="form-label">Giới tính </label>
                                        <select class="form-select w-100" aria-label="User Sex" id="sex"
                                            name="sex">
                                            <x-form.select.option label="Giới tính" :options="$sexList" />
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-7 mb-3">
                        <div class="card mb-3">
                            <div class="card-header">
                                <h4 class="title">Sổ địa chỉ</h4>
                            </div>
                            <div class="card-body">
                                <div id="address-books">

                                </div>
                                <x-button.index label="Thêm địa chỉ" id="add_address" color="outline" />
                            </div>
                        </div>
                    </div>
                </div>
                {{-- <div class="card">
                    <div class="card-header">
                        <h3>Sản phẩm trong đơn hàng</h3>
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
                                    <th scope="col" class="text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($order->items as $index => $item)
                                    <tr>
                                        <th scope="row" class="text-center">{{ $index + 1 }}</th>
                                        <td class="text-center">{{ $item->product->name }}</td>
                                        <td class="text-center">{{ number_format($item->price, 2, '.', '.') }} VNĐ</td>
                                        <td class="text-center">{{ $item->quantity }}</td>
                                        <td class="text-center">
                                            {{ number_format($item->quantity * $item->price, 2, '.', '.') }} VNĐ</td>
                                        <td class="text-center">
                                            <form
                                                action="{{ route('admin.product.destroy', $item) }}"
                                                class="d-block">
                                                @csrf
                                                @method('DELETE')
                                                <x-button.index type="submit" label="Xóa sản phẩm" class="btn-danger" />
                                            </form>

                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div> --}}
            </div>
            <div class="col-3">
                <div class="card mb-3">
                    <div class="card-header">
                        <h4 class="title">Đăng</h4>
                    </div>
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <x-button.index type="submit" label="Thêm" />
                            {{-- <form action="{{ route('admin.order.destroy', $order) }}" method="post">
                                @csrf
                                @method('DELETE')
                                <x-button.index type="submit" label="Xóa" class="btn-danger" />
                            </form> --}}
                        </div>
                    </div>
                </div>
                <div class="card mb-3">
                    <div class="card-header">
                        <h4 class="title">Xác thực tài khoản</h4>
                    </div>
                    <div class="card-body">
                        <x-form.toggle.index label="Đã xác thực email?" name="VerificationEmail" />
                    </div>
                </div>
                <div class="card mb-3">
                    <div class="card-header">
                        <h4 class="title">Ảnh đại diện</h4>
                    </div>
                    <div class="card-body">
                        <x-image.index class="mb-3" />
                        <x-button.index label="Tải ảnh" />
                    </div>
                </div>
            </div>
        </div>
    </form>
@endsection
