<div class="tab-pane fade" id="{{ $id }}-pane" role="tabpanel" aria-labelledby="{{ $id }}-tab" tabindex="0">
    <div class="row row-cols-md-2 row-cols-1">

        <!-- Icon Site -->
        <div class="col mb-3">
            <div class="bg-white-custom p-4 card-setting">
                <h4 class="title text-dark-custom mb-4">
                    Icon Site
                </h4>
                <div class="body">
                    <form action="{{ route('admin.setting.store')}}" method="post" enctype="multipart/form-data">
                        @csrf
                        <x-image.index id="icon-site" class="mb-3 img-fluid"
                            style="width: 300px; height: 300px;" :src="isset($settings['IconSite']) ? asset($settings['IconSite']) : config('settings.image_default')"
                            alt="Logo Header Light Mode" />
                        <x-button.index label="Tải ảnh" onclick="chooseImage('icon-site')" color="outline" />
                        <x-form.input_text hidden id="file-icon-site"
                            onchange="previewImage(this, 'icon-site');" type="file"
                            accept="image/png, image/jpeg, image/jpg" name="IconSite" />
                        <x-button type="submit" label="Cập nhật" style="margin-left: auto" />
                    </form>
                </div>
            </div>
        </div>

        <!-- Logo Header Light Mode -->
        <div class="col mb-3">
            <div class="bg-white-custom p-4 card-setting">
                <h4 class="title text-dark-custom mb-4">
                    Logo header Light Mode
                </h4>
                <div class="body">
                    <form action="{{ route('admin.setting.store')}}" method="post" enctype="multipart/form-data">
                        @csrf
                        <x-image.index id="image-header-light" class="mb-3 img-fluid"
                            style="width: 300px; height: 300px;" :src="isset($settings['logoHeaderLightMode']) ? asset($settings['logoHeaderLightMode']) : config('settings.image_default')"
                            alt="Logo Header Light Mode" />
                        <x-button.index label="Tải ảnh" onclick="chooseImage('image-header-light')" color="outline" />
                        <x-form.input_text hidden id="file-image-header-light"
                            onchange="previewImage(this, 'image-header-light');" type="file"
                            accept="image/png, image/jpeg, image/jpg" name="logoHeaderLightMode" />
                        <x-button type="submit" label="Cập nhật" style="margin-left: auto" />
                    </form>
                </div>
            </div>
        </div>

        <!-- Logo Header Dark Mode -->
        <div class="col mb-3">
            <div class="bg-white-custom p-4 card-setting">
                <h4 class="title text-dark-custom mb-4">
                    Logo header Dark Mode
                </h4>
                <div class="body">
                    <form action="{{ route('admin.setting.store')}}" method="post" enctype="multipart/form-data">
                        @csrf
                        <x-image.index id="image-header-dark" class="mb-3 img-fluid"
                            style="width: 300px; height: 300px;" :src="isset($settings['logoHeaderDarkMode']) ? asset($settings['logoHeaderDarkMode']) : config('settings.image_default')"
                            alt="Logo Header Dark Mode" />
                        <x-button.index label="Tải ảnh" onclick="chooseImage('image-header-dark')" color="outline" />
                        <x-form.input_text hidden id="file-image-header-dark"
                            onchange="previewImage(this, 'image-header-dark');" type="file"
                            accept="image/png, image/jpeg, image/jpg" name="logoHeaderDarkMode" />
                        <x-button type="submit" label="Cập nhật" style="margin-left: auto" />
                    </form>
                </div>
            </div>
        </div>

        <!-- Logo Footer Light Mode -->
        <div class="col mb-3">
            <div class="bg-white-custom p-4 card-setting">
                <h4 class="title text-dark-custom mb-4">
                    Logo footer Light Mode
                </h4>
                <div class="body">
                    <form action="{{ route('admin.setting.store')}}" method="post" enctype="multipart/form-data">
                        @csrf
                        <x-image.index id="image-footer-light" class="mb-3 img-fluid"
                            style="width: 300px; height: 300px;" :src="isset($settings['logoFooterLightMode']) ? asset($settings['logoFooterLightMode']) : config('settings.image_default')"
                            alt="Logo Footer Light Mode" />
                        <x-button.index label="Tải ảnh" onclick="chooseImage('image-footer-light')" color="outline" />
                        <x-form.input_text hidden id="file-image-footer-light"
                            onchange="previewImage(this, 'image-footer-light');" type="file"
                            accept="image/png, image/jpeg, image/jpg" name="logoFooterLightMode" />
                        <x-button type="submit" label="Cập nhật" style="margin-left: auto" />
                    </form>
                </div>
            </div>
        </div>

        <!-- Logo Footer Dark Mode -->
        <div class="col mb-3">
            <div class="bg-white-custom p-4 card-setting">
                <h4 class="title text-dark-custom mb-4">
                    Logo footer Dark Mode
                </h4>
                <div class="body">
                    <form action="{{ route('admin.setting.store')}}" method="post" enctype="multipart/form-data">
                        @csrf
                        <x-image.index id="image-footer-dark" class="mb-3 img-fluid"
                            style="width: 300px; height: 300px;" :src="isset($settings['logoFooterDarkMode']) ? asset($settings['logoFooterDarkMode']) : config('settings.image_default')"
                            alt="Logo Footer Dark Mode" />
                        <x-button.index label="Tải ảnh" onclick="chooseImage('image-footer-dark')" color="outline" />
                        <x-form.input_text hidden id="file-image-footer-dark"
                            onchange="previewImage(this, 'image-footer-dark');" type="file"
                            accept="image/png, image/jpeg, image/jpg" name="logoFooterDarkMode" />
                        <x-button type="submit" label="Cập nhật" style="margin-left: auto" />
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

@push('scripts')
    <x-script.upload_images idPreview="image-header-light" inputId="file-image-header-light" />
    <x-script.upload_images idPreview="image-header-dark" inputId="file-image-header-dark" />
    <x-script.upload_images idPreview="image-footer-light" inputId="file-image-footer-light" />
    <x-script.upload_images idPreview="image-footer-dark" inputId="file-image-footer-dark" />
@endpush