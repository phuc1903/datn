@extends('layouts.app')

@section('content')
    <form action="{{ route('admin.category.store') }}" method="post" enctype="multipart/form-data">
        @csrf
        <div class="row card-custom">
            <div class="col-12 col-md-9">
                <div class="card card-custom mb-3">
                    <div class="card-header card-header-custom">
                        <h3 class="title">Thêm danh mục</h3>
                    </div>
                    <div class="card-body">
                        <x-form.input_text label="Tên danh mục" name="name" id="name" />
                        <div class="mb-3">
                            <label for="" class="form-label fw-bold text-dark-custom">Danh mục cha</label>
                            <select class="form-select selec-custom input-text-custom" name="parent_id" id="parent_id">
                                <option value="0" selected>Không có</option>
                                @foreach ($categories as $cate)
                                    @php
                                        $parentCount = $cate->getParentCount();
                                        $prefix = str_repeat('-', $parentCount);
                                    @endphp
                                    <option value="{{ $cate->id }}">{{ $prefix }} {{ $cate->name }}</option>
                                @endforeach
                            </select>
                        </div>

                        <x-form.input_text label="Slug" name="slug" id="slug" />

                        <div class="form-floating mb-3">
                            <textarea class="form-control input-text-custom @error('short_description') is-invalid @enderror"
                                value="{{ old('short_description') }}" name="short_description" placeholder="Leave a comment here"
                                id="floatingTextarea" style="height: 100px"></textarea>
                            <label for="floatingTextarea" class="text-dark-custom">Mô tả ngắn</label>
                            @error('short_description')
                                <div class="invalid-feedback">
                                    {{ $message }}
                                </div>
                            @enderror
                        </div>

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
                <div class="card mb-3">
                    <div class="card-header">
                        <h5 class="title">Hình ảnh danh mục</h5>
                    </div>
                    <div class="card-body">
                        <x-image.index id="imagePreview" class="mb-3 img-fluid" :src="config('settings.image_default')" alt="Hình ảnh danh mục" />

                        <x-button.index label="Tải ảnh" onclick="chooseImage()" />

                        <x-form.input_text hidden id="typeFile" onchange="previewImage(this);" type="file"
                            accept="image/png, image/jpeg, image/jpg" name="image" />
                    </div>
                </div>
            </div>
        </div>
    </form>
@endsection

@push('scripts')
    <x-script.upload_image idPreview="imagePreview" />
@endpush
