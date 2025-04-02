<div class="tab-pane fade show active" id="{{ $id }}-pane" role="tabpanel" aria-labelledby="{{ $id }}-tab" tabindex="0">
    <div class="row row-cols-md-2 row-cols-1">
        <div class="col mb-4">
            <div class="bg-white-custom p-4 card-setting">
                <h4 class="title text-dark-custom mb-4">
                    Hỗ trợ khách hàng Home
                </h4>
                <div class="body">
                    <form action="{{ route('admin.setting.store')}}" method="post" enctype="multipart/form-data">
                        @csrf
                        <div class="item mb-4">
                            <h5 class="text-dark-custom mb-3">Tên Site</h5>
                            <x-form.input_text label="Nội dung" name="NameWebsite"
                                value="{{ isset($settings['NameWebsite']) ? $settings['NameWebsite'] : '' }}" />

                        </div>
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
        <div class="col mb-4">
            <div class="bg-white-custom p-4 card-setting">
                <h4 class="title text-dark-custom mb-4">
                    Ảnh kêu gọi đăng ký tài khoản Home
                </h4>
                <div class="body">
                    <form action="{{ route('admin.setting.store')}}" method="post" enctype="multipart/form-data">
                        @csrf
                        <x-image.index id="image-action-sign-up-home" class="mb-3 img-fluid"
                            style="width: 300px; height: 300px;" :src="isset($settings['imageActionSignUpHome']) ? asset($settings['imageActionSignUpHome']) : config('settings.image_default')"
                            alt="Logo Header Light Mode" />
                        <x-button.index label="Tải ảnh" onclick="chooseImage('image-action-sign-up-home')" color="outline" />
                        <x-form.input_text hidden id="file-image-action-sign-up-home"
                            onchange="previewImage(this, 'image-action-sign-up-home');" type="file"
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
                                        <x-form.input_text label="Nhập tiêu đề {{ $i + 1 }}" name="supports[{{ $i }}]['title']"
                                            value="{{ $support[$i]['title'] ?? '' }}" />
                                    </div>
                                    <div class="col">
                                        <x-form.input_text label="Nhập mô tả {{ $i + 1 }}"
                                            name="supports[{{ $i }}][description]"
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
                    Banner giới thiệu Voucher Trang Chủ
                </h4>
                <div class="body">
                    <form action="{{ route('admin.setting.store')}}" method="post" enctype="multipart/form-data">
                        @csrf
                        <x-image.index id="image-introduce-voucher" class="mb-3 img-fluid image-setting-banner"
                            style="width: 300px; height: 300px;" :src="isset($settings['imageIntroduceVoucher']) ? asset($settings['imageIntroduceVoucher']) : config('settings.image_default')"
                            alt="Logo Header Light Mode" />
                        <x-button.index label="Tải ảnh" onclick="chooseImage('image-introduce-voucher')" color="outline" />
                        <x-form.input_text hidden id="file-image-introduce-voucher"
                            onchange="previewImage(this, 'image-introduce-voucher');" type="file"
                            accept="image/png, image/jpeg, image/jpg" name="imageIntroduceVoucher" />
                        <x-button type="submit" label="Cập nhật" style="margin-left: auto" />
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

@push('scripts')
    <x-script.upload_images idPreview="image-action-sign-up-home" inputId="file-image-action-sign-up-home" />
    <x-script.upload_images idPreview="image-introduce-voucher" inputId="file-image-introduce-voucher" />
@endpush