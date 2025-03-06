@extends('layouts.app')

@section('content')
    <form action="{{ route('admin.product.store') }}" method="post" enctype="multipart/form-data">
        @csrf
        <div class="row card-custom">
            <div class="col-12 col-md-9">
                <div class="card card-custom mb-3">
                    <div class="card-header card-header-custom">
                        <h3 class="title">Thêm sản phẩm</h3>
                    </div>
                    <div class="card-body">
                        <x-form.input_text label="Tên sản phẩm" name="name" />
                        <div class="form-floating mb-3">
                            <textarea class="form-control input-text-custom" name="short_description" placeholder="Leave a comment here"
                                id="floatingTextarea" style="height: 100px"></textarea>
                            <label for="floatingTextarea" class="text-dark-custom">Mô tả ngắn</label>
                        </div>
                        <textarea id="description" class="input-text-custom" name="description"></textarea>
                    </div>
                </div>
                <div class="card card-custom mb-3">
                    <div class="card-header">
                        <div class="mb-3 d-flex gap-3 align-items-center">
                            <label for="product-type" class="form-label text-dark-custom mb-0">Dữ liệu sản phẩm</label>
                            <select id="product-type" class="form-select input-text-custom select-type-data-product">
                                <option value="simple">Sản phẩm đơn giản</option>
                                <option value="variable">Sản phẩm có biến thể</option>
                            </select>
                        </div>
                    </div>
                    {{-- @php
                        $statusWarehouse = [
                            ['value' => 'in_stock', 'label' => 'Còn hàng'],
                            ['value' => 'out_of_stock', 'label' => 'Hết hàng'],
                        ];
                    @endphp --}}

                    <div class="card-body padding-0 card-type-product">
                        <div id="simple-product" class="h-100">
                            @include('Pages.Product.Components.navtab.navtab_1')
                        </div>

                        <div id="variable-product" class="h-100" style="display: none;">
                            @include('Pages.Product.Components.navtab.navtab_2')
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
                            <x-form.select.option :options="$productStatus" />
                        </select>
                    </div>
                </div>
                <div class="card mb-3">
                    <div class="card-header">
                        <h5 class="title">Sản phẩm nổi bậc</h5>
                    </div>
                    <div class="card-body">
                        <select class="form-select selec-custom input-text-custom" aria-label="Default select example"
                            name="is_hot">
                            @php
                                $hotArray = [['value' => 1, 'label' => 'Có'], ['value' => 0, 'label' => 'Không']];
                            @endphp
                            <x-form.select.option :options="$hotArray" />
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
                                <label class="form-check-label text-dark-custom" for="{{ $cate->name . '-' . $cate->id }}">
                                    {{ $cate->name }}
                                </label>
                            </div>
                        @endforeach
                    </div>
                </div>
                <div class="card mb-3">
                    <div class="card-header">
                        <h5 class="title">Chọn thẻ</h5>
                    </div>
                    <div class="card-body choseCategories">
                        @foreach ($tags as $tag)
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" name="tags[]"
                                    value="{{ $tag->id }}" id="{{ $tag->name . '-' . $tag->id }}">
                                <label class="form-check-label text-dark-custom" for="{{ $tag->name . '-' . $tag->id }}">
                                    {{ $tag->name }}
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
            height: 300
        });
    </script>
@endpush
