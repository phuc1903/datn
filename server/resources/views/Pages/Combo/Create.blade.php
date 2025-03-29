@extends('layouts.app')

@section('content')
    <form action="{{ route('admin.combo.store') }}" method="post" enctype="multipart/form-data">
        @csrf
        <div class="row card-custom combo">
            <div class="col-12 col-md-9">
                <div class="card card-custom mb-3">
                    <div class="card-header card-header-custom">
                        <h3 class="title">Thêm Combo</h3>
                    </div>
                    <div class="card-body">
                        <x-form.input_text label="Tên Combo" name="name" id="name" />

                        <x-form.input_text label="Slug" name="slug" id="slug" />

                        <div class="row mb-3">
                            <div class="col-12 col-md-2">
                                <x-form.input_text label="Số lượng" name="quantity" class="numeric" type="number" />
                            </div>
                            <div class="col-12 col-md-5">
                                <x-form.input_text label="Giá" name="price" class="price numeric" />
                            </div>
                            <div class="col-12 col-md-5">
                                <x-form.input_text label="Giá giảm" name="promotion_price" class="price numeric"  />
                            </div>
                        </div>

                        <div class="row mb-3">
                            <div class="col-12 col-md-6">
                                <x-form.input_text label="Ngày bắt đầu" name="date_start" type="date" />
                            </div>
                            <div class="col-12 col-md-6">
                                <x-form.input_text label="Ngày kết thúc" name="date_end" type="date" />
                            </div>
                        </div>

                        <div class="form-floating mb-3">
                            <textarea class="form-control input-text-custom @error('short_description') is-invalid @enderror"
                                name="short_description" placeholder="Leave a comment here"
                                id="floatingTextarea" style="height: 100px">{{ old('short_description') }}</textarea>
                            <label for="floatingTextarea" class="text-dark-custom">Mô tả ngắn</label>
                            @error('short_description')
                                <div class="invalid-feedback">
                                    {{ $message }}
                                </div>
                            @enderror
                        </div>

                        <textarea id="description" class="input-text-custom" name="description">{{ old('description') }}</textarea>
                        @error('description')
                            <div class="text-danger mt-2">
                                {{ $message }}
                            </div>
                        @enderror
                    </div>
                </div>
                <div class="card card-product mb-3">
                    <div class="card-header">
                        <div class="d-flex justify-content-between">
                            <h3 class="title">Chọn sản phẩm vào combo</h3>
                            <x-button.index label="Thêm sản phẩm" data-bs-toggle="modal" data-bs-target="#choseSkus" />
                            @include('Pages.Combo.Components.Skus', ['skus' => $skus])
                            @error('skus')
                            <div class="text-danger mt-2">
                                {{ $message }}
                            </div>
                        @enderror
                        </div>
                    </div>
                    <div class="card-body">
                        <div id="sku-list">
                            
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
                        <h5 class="title">Combo nổi bậc</h5>
                    </div>
                    <div class="card-body">
                        <select class="form-select selec-custom input-text-custom" aria-label="Default select example"
                            name="is_hot">
                            @foreach ($hots as $key => $sta)
                                <option value="{{ $key }}">{{ $sta }}</option>
                            @endforeach
                        </select>
                    </div>
                </div>
                <div class="card mb-3">
                    <div class="card-header">
                        <h5 class="title">Chọn danh mục</h5>
                    </div>
                    <div class="card-body choseCategories">
                        @foreach ($categories as $cate)
                            @php
                                $parentCount = $cate->getParentCount();
                                $pxMargin = 15 * $parentCount;
                            @endphp
                            <div class="form-check mf-level" style="--cat-depth: {{ $pxMargin }}px;">
                                <input class="form-check-input" type="checkbox" name="categories[]"
                                    value="{{ $cate->id }}" id="{{ $cate->name . '-' . $cate->id }}">
                                <label class="form-check-label text-dark-custom"
                                    for="{{ $cate->name . '-' . $cate->id }}">
                                    {{ $cate->name }}
                                </label>
                            </div>
                        @endforeach
                    </div>
                </div>
                <div class="card mb-3">
                    <div class="card-header">
                        <h5 class="title">Hình ảnh sản phẩm</h5>
                    </div>
                    <div class="card-body">
                        <x-image.index id="image-product" class="mb-3 img-fluid" :src="config('settings.image_default')" alt="Hình ảnh danh mục" />

                        <x-button.index label="Tải ảnh" onclick="chooseImage()" />

                        <x-form.input_text hidden id="typeFile" onchange="previewImage(this);" type="file"
                            accept="image/png, image/jpeg, image/jpg" name="image_url" />
                    </div>
                </div>
            </div>
        </div>
    </form>
@endsection

@push('libs-js')
    <script src="{{ asset('ckeditor/ckeditor.js') }}"></script>
@endpush

@push('scripts')
    <x-script.upload_image idPreview="image-product" />
    <script>
        CKEDITOR.replace('description', {
            language: 'vi',
            height: 300,
            contentsCss: [
                'body { background-color: var(--background) !important; color: var(--foreground) !important;}',
            ],
        });
    </script>
@endpush
