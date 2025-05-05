@extends('layouts.app')

@section('content')
    <div class="row row-cols-md-2 row-cols-1">
        @php
            $imageDefault = config('settings.image_default');
        @endphp

        @php
            $images = [
                ['title' => 'Icon Site', 'id' => 'icon-site', 'name' => 'IconSite', 'mode' => 'light'],
                ['title' => 'Logo header Light Mode', 'id' => 'image-header-light', 'name' => 'logoHeaderLightMode', 'mode' => 'light'],
                ['title' => 'Logo header Dark Mode', 'id' => 'image-header-dark', 'name' => 'logoHeaderDarkMode', 'mode' => 'dark'],
                ['title' => 'Logo footer Light Mode', 'id' => 'image-footer-light', 'name' => 'logoFooterLightMode', 'mode' => 'light'],
                ['title' => 'Logo footer Dark Mode', 'id' => 'image-footer-dark', 'name' => 'logoFooterDarkMode', 'mode' => 'dark'],
            ];
        @endphp

        @foreach ($images as $img)
            <div class="col mb-3">
                <div class="{{ $img['mode'] === 'dark' ? 'bg-dark-custom' : 'bg-white-custom' }} p-4 card-setting">
                    <h4 class="title {{ $img['mode'] === 'dark' ? 'text-white' : 'text-dark-custom' }} mb-4">{{ $img['title'] }}</h4>
                    <div class="body">
                        <form action="{{ route('admin.setting.store') }}" method="post" enctype="multipart/form-data">
                            @csrf
                            <x-image.index
                                :id="$img['id']"
                                class="mb-3 img-fluid"
                                style="width: 300px; height: 300px;"
                                :src="isset($logos[$img['name']]) ? asset($logos[$img['name']]) : $imageDefault"
                                :alt="$img['title']" />

                            <x-button.index :label="'Tải ảnh'" :onclick="'chooseImage(\'' . $img['id'] . '\')'" color="outline" />

                            <x-form.input_text
                                hidden
                                :id="'file-' . $img['id']"
                                :onchange="'previewImage(this, \'' . $img['id'] . '\')'"
                                type="file"
                                accept="image/png, image/jpeg, image/jpg"
                                :name="$img['name']" />

                            <x-button type="submit" label="Cập nhật" style="margin-left: auto" />
                        </form>
                    </div>
                </div>
            </div>
        @endforeach
    </div>

    @push('scripts')
        @foreach ($images as $img)
            <x-script.upload_images :idPreview="$img['id']" :inputId="'file-' . $img['id']" />
        @endforeach
    @endpush
@endsection
