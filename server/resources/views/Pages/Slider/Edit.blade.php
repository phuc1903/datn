@extends('layouts.app')

@section('content')
    <form action="{{ route('admin.slider.update', $slider) }}" method="post" enctype="multipart/form-data">
        @csrf
        @method('PUT')
        <div class="row card-custom">
            <div class="col-12 col-md-9">
                <div class="card card-custom mb-3">
                    <div class="card-header card-header-custom">
                        <h3 class="title">Sửa Slider</h3>
                    </div>
                    <div class="card-body">
                        <x-form.input_text laabel="Tên Slider" name="name" value="{{ $slider->name}}" />
                        <div class="mb-3">
                            <label for="" class="form-label fw-bold text-dark-custom">Hình</label>
                            <x-image.index id="imagePreview" class="mb-3 img-fluid slider" src="{{ $slider->image_url}}"
                                alt="Hình ảnh danh mục" />

                            <x-button.index label="Tải ảnh" onclick="chooseImage()" />

                            <x-form.input_text hidden id="typeFile" onchange="previewImage(this);" type="file"
                                accept="image/png, image/jpeg, image/jpg" value="{{ $slider->image_url}}" name="image_url" />
                        </div>
                        <x-form.input_text type="number" value="{{ $slider->priority}}" label="Chọn độ ưu tiên của slide này" name="priority" />
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-3">
                <div class="card mb-3">
                    <div class="card-header">
                        <h5 class="title">Đăng</h5>
                    </div>
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <x-button.index type="submit" label="Sửa" />
                        </div>
                    </div>
                </div>
                <div class="card mb-3">
                    <div class="card-header">
                        <h5 class="title">Trạng thái</h5>
                    </div>
                    <div class="card-body">
                        <select class="form-select selec-custom input-text-custom" aria-label="Default select example"
                            name="status">
                            <option value="{{ $sta['value']}}" selected>{{ $sta['label'] }}</option>
                            <x-form.select.option :options="$status" />
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </form>
@endsection

@push('scripts')
    <x-script.upload_image idPreview="imagePreview" />
@endpush
