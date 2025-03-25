@extends('layouts.app')

@section('content')
    <h1 class="mb-5 text-dark-custom">Cài đặt chung</h1>

    <div class="row row-cols-md-2 row-cols-1">
        <div class="col mb-4">
            <div class="bg-white-custom p-4 card-setting">
                <h4 class="title text-dark-custom mb-4">
                    Ảnh kêu gọi đăng ký tài khoản Home
                </h4>
                <div class="body">
                    <form action="{{ route('admin.setting.store')}}" method="post" enctype="multipart/form-data">
                        @csrf
                        <x-image.index id="image-action-sign-up-home" class="mb-3 img-fluid"
                            style="width: 300px; height: 300px;" :src="isset($settings['imageActionSignUpHome']) ? asset($settings->get('imageActionSignUpHome')) : config('settings.image_default')"
                            alt="Hình ảnh danh mục" />

                        <x-button.index label="Tải ảnh" onclick="chooseImage()" color="outline" />

                        <x-form.input_text hidden id="typeFile" onchange="previewImage(this);" type="file"
                            accept="image/png, image/jpeg, image/jpg" name="imageActionSignUpHome" />

                        <x-button type="submit" label="Cập nhật" style="margin-left: auto" />
                    </form>
                </div>
            </div>
        </div>
        <div class="col mb-4">
            <div class="bg-white-custom p-4 card-setting">
                <h4 class="title text-dark-custom mb-4">
                    Hỗ trợ khách hàng Home
                </h4>
                <div class="body">
                    <form action="{{ route('admin.setting.store')}}" method="post" enctype="multipart/form-data">
                        @csrf
                        @php
                            $support = $settings->get('supports') ?? [];
                            $defaultCount = max(3, count($support));

                            for ($i = count($support); $i < $defaultCount; $i++) {
                                $support[] = ['title' => '', 'description' => ''];
                            }
                        @endphp

                        @for($i = 0; $i < $defaultCount; $i++)
                            <div class="item mb-4">
                                <h5 class="text-dark-custom mb-3">Hỗ trợ {{ $i + 1 }}</h5>
                                <div class="row row-cols-2">
                                    <div class="col">
                                        <x-form.input_text label="Nhập tiêu đề {{ $i + 1 }}" name="supports[{{ $i }}][title]"
                                            value="{{ $support[$i]['title'] ?? '' }}" />
                                    </div>
                                    <div class="col">
                                        <x-form.input_text label="Nhập mô tả {{ $i + 1 }}" name="supports[{{ $i }}][description]"
                                            value="{{ $support[$i]['description'] ?? '' }}" />
                                    </div>
                                </div>
                            </div>
                        @endfor
                        <x-button type="submit" label="Cập nhật" style="margin-left: auto" />
                    </form>
                </div>
            </div>
        </div>
        <div class="col mb-4">
            <div class="bg-white-custom p-4 card-setting">
                <h4 class="title text-dark-custom mb-4">
                    Hỗ trợ khách hàng Home
                </h4>
                <div class="body">
                    <form action="{{ route('admin.setting.store')}}" method="post" enctype="multipart/form-data">
                        @csrf
                        <div class="item mb-4">
                            <h5 class="text-dark-custom mb-3">Thông báo nhanh trên top header</h5>
                            <x-form.input_text label="Nội dung" name="AnnouncementBar"
                                value="{{ isset($settings['AnnouncementBar']) ? $settings['AnnouncementBar'] : '' }}" />

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