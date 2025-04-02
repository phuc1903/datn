@extends('Layouts.default')

@section('content')
    <div class="container d-flex align-items-center justify-content-center min-vh-100" style="width: 400px;">
        <div class="login-card shadow p-4 rounded w-100">
            <div class="p-4">
                <h3 class="text-primary fw-bold">Đăng nhập</h3>
                <p class="text-muted">Đăng nhập tài khoản của bạn</p>
                <form action="{{route('login.store')}}" method="post">
                    @csrf
                    <x-form.input_text type="email" label="Nhập email" name="email"/>
                    <x-form.input_text type="password" label="Nhập mật khẩu" name="password"/>
                    <x-button.index label="Đăng nhâp" type="submit" class="w-100 justify-content-center align-items-center"/>
                </form>
            </div>
        </div>
    </div>
@endsection
