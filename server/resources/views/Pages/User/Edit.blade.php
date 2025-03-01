@extends('layouts.app')

@section('content')
    <form action="{{ route('admin.user.update', $user) }}" method="post" enctype="multipart/form-data">
        @csrf
        @method("PUT")
        <div class="row card-custom">
            <div class="col-12 col-md-9">
                <div class="row">
                    <div class="col-12 col-md-5 mb-3">
                        <div class="card">
                            <div class="card-header">
                                <h4 class="title">Thông tin chính</h4>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <x-form.input_text label="Họ" name="last_name" value="{{$user->last_name}}"/>
                                    <x-form.input_text label="Tên" value="{{$user->first_name}}" name="first_name"/>
                                    <x-form.input_text label="Email" value="{{$user->email}}" name="email" type="email"/>
                                    <x-form.input_text label="Số điện thoại" value="{{$user->phone_number}}" name="phone_number"/>
                                    <x-form.input_text label="Mật khẩu" value="" name="password" type="password"/>
                                    <x-form.input_text label="Xác nhận mật khẩu" value="" name="password_confirm" type="password" />
                                    <div class="mb-3">
                                        <label for="sex" class="form-label">Giới tính </label>
                                        <select class="form-select w-100" aria-label="User Sex" id="sex"
                                            name="sex">
                                            <x-form.select.option :options="$sexList" />
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-7 mb-3">
                        <div class="card mb-3">
                            <div class="card-header">
                                <h4 class="title">Sổ địa chỉ</h4>
                            </div>
                            <div class="card-body">
                                <div id="address-books" data-addresses="{{$user->addresses}}">

                                </div>
                                <x-button.index label="Thêm địa chỉ" id="add_address" color="outline" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-3">
                <div class="card mb-3">
                    <div class="card-header">
                        <h4 class="title">Đăng</h4>
                    </div>
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <x-button.index type="submit" label="Cập nhật" />
                            @php

                                $route = route("admin.user.destroy", $user)

                            @endphp
                            <x-button.index  type="button" label="Xóa" id="delete-user" color="danger" data-route-delete="{{ $route }}"/>
                        </div>
                    </div>
                </div>
                <div class="card mb-3">
                    <div class="card-header">
                        <h4 class="title">Trạng thái</h4>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <select class="form-select w-100" aria-label="User Sex" id="status" name="status">
                                <option value="{{ $statusActiveValue }}" selected>{{ $statusActive }}</option>
                                <x-form.select.option label="Giới tính" :options="$statusList" />
                            </select>
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
