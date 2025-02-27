@extends('layouts.app')

@section('content')
    <form action="{{ route('admin.slider.store') }}" method="post" enctype="multipart/form-data">
        @csrf
        <div class="row card-custom">
            <div class="col-12 col-md-9">
                <div class="card card-custom mb-3">
                    <div class="card-header card-header-custom">
                        <h3 class="title">Thêm Slider</h3>
                    </div>
                    <div class="card-body">
                        <x-form.input_text laabel="Tên Slider" name="name" />
                        <div class="mb-3">
                            <label for="" class="form-label fw-bold text-dark-custom">Hình</label>
                            <x-image.index id="imagePreview" class="mb-3 img-fluid slider" :src="config('settings.image_default')"
                                alt="Hình ảnh danh mục" />

                            <x-button.index label="Tải ảnh" onclick="chooseImage()" />

                            <x-form.input_text hidden id="typeFile" onchange="previewImage(this);" type="file"
                                accept="image/png, image/jpeg, image/jpg" name="image_url" />
                        </div>
                        <x-form.input_text type="number" label="Chọn độ ưu tiên của slide này" name="priority" />
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
                            <x-button.index type="submit" label="Thêm" />
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
                            @foreach ($status as $key => $sta)
                                <option value="{{ $key }}">{{ $sta }}</option>
                            @endforeach
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
