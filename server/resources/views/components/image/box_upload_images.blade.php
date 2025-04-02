@props(['name' => '','id' => '', 'src', 'class' => 'image-preview-upload', 'alt' => ''])

<x-image.index id="{{ $id }}" class="mb-3 img-fluid {{ $class }}" :src="isset($src) ? asset($src) : config('settings.image_default')" alt="{{ $alt }}" />
<x-button.index label="Tải ảnh" onclick="chooseImage('{{ $id }}')" color="outline" />
<x-form.input_text hidden id="file-{{ $id }}" onchange="previewImage(this, '{{ $id }}');"
    type="file" accept="image/png, image/jpeg, image/jpg" name="{{ $name }}" />

@push('scripts')
    <x-script.upload_images idPreview="{{ $id }}" inputId="file-{{ $id }}" />
@endpush