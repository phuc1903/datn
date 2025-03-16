@extends('layouts.app')

@section('content')
    <h1 class="mb-5 text-dark-custom">Cài đặt</h1>

    <div class="row row-cols-md-2 row-cols-1">
        <div class="col">
            <div class="bg-white-custom p-4 card-setting">
                <h4 class="title text-dark-custom mb-4">
                    Ảnh kêu gọi đăng ký tài khoản Home
                </h4>
                <div class="body">
                    <form action="{{ route('admin.setting.store')}}"  method="post" enctype="multipart/form-data">
                        @csrf
                        <input hidden name="name" value="imageActionSignUpHome" />
                        <x-image.index id="image-action-sign-up-home" class="mb-3 img-fluid"
                            style="width: 300px; height: 300px;" :src="config('settings.image_default')"
                            alt="Hình ảnh danh mục" />

                        <x-button.index label="Tải ảnh" onclick="chooseImage()" />

                        <x-form.input_text hidden id="typeFile" onchange="previewImage(this);" type="file"
                            accept="image/png, image/jpeg, image/jpg" name="value" />

                        <x-button type="submit" label="Cập nhật" style="margin-left: auto" />
                    </form>
                </div>
            </div>
        </div>
        <div class="col">
            <div class="bg-white-custom p-4 card-setting">
                <h4 class="title text-dark-custom mb-4">
                    Hỗ trợ khách hàng Home
                </h4>
                <div class="body">
                    <form action="{{ route('admin.setting.store')}}" method="post" enctype="multipart/form-data">
                        @csrf
                        <input hidden name="name" value="support" />
                        <div class="item mb-4">
                            <h5 class="text-dark-custom mb-3">Hỗ trợ 1</h5>
                            <div class="row row-cols-2">
                                <div class="col">
                                    <x-form.input_text label="Nhập tiêu đề 1" name="values[0][title]" />
                                </div>
                                <div class="col">
                                    <x-form.input_text label="Nhập mô tả 1" name="values[0][description]" />
                                </div>
                            </div>
                        </div>
                        <div class="item mb-4">
                            <h5 class="text-dark-custom mb-3">Hỗ trợ 2</h5>
                            <div class="row row-cols-2">
                                <div class="col">
                                    <x-form.input_text label="Nhập tiêu đề 2" name="values[1][title]" />
                                </div>
                                <div class="col">
                                    <x-form.input_text label="Nhập mô tả 2" name="values[1][description]" />
                                </div>
                            </div>
                        </div>
                        <div class="item mb-4">
                            <h5 class="text-dark-custom mb-3">Hỗ trợ 3</h5>
                            <div class="row row-cols-2">
                                <div class="col">
                                    <x-form.input_text label="Nhập tiêu đề 3" name="values[2][title]" />
                                </div>
                                <div class="col">
                                    <x-form.input_text label="Nhập mô tả 3" name="values[2][description]" />
                                </div>
                            </div>
                        </div>
                        <x-button type="submit" label="Cập nhật" style="margin-left: auto" />
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection

@push('scripts')
    <x-script.upload_image idPreview="image-action-sign-up-home" />
@endpush