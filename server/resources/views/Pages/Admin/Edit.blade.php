@extends('layouts.app')

@section('content')
<form action="{{ route('admin.admin.update', $admin) }}" method="post" enctype="multipart/form-data">
        @csrf
        @method("PUT")
        <div class="row card-custom">
            <div class="col-12 col-md-9">
                <div class="row">
                    <div class="col-12 col-md-5 mb-3">
                        <div class="card">
                            <div class="card-header">
                                <h4 class="title">Chọn vai trò</h4>
                            </div>
                            <div class="card-body">
                                @foreach ($roles as $role)
                                    <div class="form-check">
                                        <input class="form-check-input" name="roles[]" type="checkbox" value="{{ $role->name }}"
                                            id="admin-role-{{$role->id}}" @if($role->checked) checked @endif>
                                        <label class="form-check-label text-dark-custom" for="admin-role-{{$role->id}}">
                                            {{ $role->title}}
                                        </label>
                                    </div>
                                @endforeach
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-7 mb-3">
                        <div class="card">
                            <div class="card-header">
                                <h4 class="title">Thông tin chính</h4>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <x-form.input_text label="Họ" name="last_name" value="{{ $admin->last_name}}" />
                                    <x-form.input_text label="Tên" name="first_name" value="{{ $admin->first_name}}" />
                                    <x-form.input_text label="Email" name="email" type="email" value="{{ $admin->email}}" />
                                    <x-form.input_text label="Số điện thoại" name="phone_number" value="{{ $admin->phone_number}}" />
                                    <x-form.input_text label="Mật khẩu" name="password" type="password" />
                                    <x-form.input_text label="Xác nhận mật khẩu" name="password_confirm" type="password" />
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
                        <h5 class="title">Ảnh đại diện</h5>
                    </div>
                    <div class="card-body">
                        <x-image.index id="admin-avatar" class="mb-3 img-fluid" :src="config('settings.image_default')"
                            alt="Hình ảnh danh mục" />

                        <x-button.index label="Tải ảnh" onclick="chooseImage()" />

                        <x-form.input_text hidden id="typeFile" onchange="previewImage(this);" type="file"
                            accept="image/png, image/jpeg, image/jpg" name="image_url" />
                    </div>
                </div>
            </div>
        </div>
    </form>
@endsection


@push('scripts')
    <x-script.upload_image idPreview="admin-avatar" />
    <script>
        CKEDITOR.replace('description', {
            language: 'vi',
            height: 300
        });
    </script>
@endpush