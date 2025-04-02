@extends('layouts.app')

@section('content')
    <form action="{{ route('admin.category.update', $category) }}" method="post" enctype="multipart/form-data">
        @csrf
        @method('PUT')
        <div class="row card-custom">
            <div class="col-12 col-md-9">
                <div class="card card-custom mb-3">
                    <div class="card-header card-header-custom">
                        <h3 class="title">Chỉnh sửa danh mục danh mục</h3>
                    </div>
                    <div class="card-body">
                        <x-form.input_text label="Tên danh mục" name="name" value="{{ $category->name }}" id="name" />
                        <div class="mb-3">
                            <label for="" class="form-label fw-bold text-dark-custom">Danh mục cha</label>
                            <select class="form-select selec-custom input-text-custom" aria-label="Default select example"
                                name="parent_id">
                                @if (isset($categoryActive))
                                    <option value="{{ $categoryActive->id }}" selected>{{ $categoryActive->name }}</option>
                                @endif
                                <option value="0">Không có</option>
                                @foreach ($categories as $cate)
                                    @php
                                        $parentCount = $cate->getParentCount();
                                        $prefix = str_repeat('-', $parentCount);
                                    @endphp
                                    <option value="{{ $cate->id }}">{{ $prefix }} {{ $cate->name }}</option>
                                @endforeach
                            </select>
                        </div>

                        <x-form.input_text label="Slug" name="slug" value="{{ $category->slug ?? '' }}" id="slug" />

                        <div class="form-floating mb-3">
                            <textarea class="form-control input-text-custom" name="short_description" placeholder="Leave a comment here"
                                id="floatingTextarea" style="height: 100px">{{ $category->short_description }}</textarea>
                            <label for="floatingTextarea" class="text-dark-custom">Mô tả ngắn</label>
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
                            <x-button.index type="submit" label="Cập nhật" />
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
                            @if (isset($sta['value']) && isset($sta['label']))
                                <option value="{{ $sta['value'] }}" selected>{{ $sta['label'] }}</option>
                            @endif
                            <x-form.select.option :options="$status" />
                        </select>
                    </div>
                </div>
                <div class="card mb-3">
                    <div class="card-header">
                        <h5 class="title">Hình ảnh danh mục</h5>
                    </div>
                    <div class="card-body">
                        <x-image.index id="imagePreview" class="mb-3 img-fluid" src="{{ asset($category->image) }}"
                            alt="{{ $category->name }}" />

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
