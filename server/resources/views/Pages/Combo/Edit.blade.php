@extends('layouts.app')

@section('content')
    <form action="{{ route('admin.combo.update', $combo) }}" method="post" enctype="multipart/form-data">
        @csrf
        @method('PUT')
        <div class="row card-custom combo">
            <div class="col-12 col-md-9">
                <div class="card card-custom mb-3">
                    <div class="card-header card-header-custom">
                        <h3 class="title">Chỉnh sửa Combo</h3>
                    </div>
                    <div class="card-body">
                        <x-form.input_text label="Tên Combo" name="name" id="name" value="{{ $combo->name }}" />

                        <x-form.input_text label="Slug" name="slug" id="slug" value="{{ $combo->slug }}" />

                        <div class="row mb-3">
                            <div class="col-12 col-md-2">
                                <x-form.input_text label="Số lượng" name="quantity" type="number" value="{{ $combo->quantity }}" />
                            </div>
                            <div class="col-12 col-md-5">
                                <x-form.input_text label="Giá" name="price" class="price" value="{{ $combo->price}}" />
                            </div>
                            <div class="col-12 col-md-5">
                                <x-form.input_text label="Giá giảm" name="promotion_price" class="price" value="{{ $combo->promotion_price}}"  />
                            </div>
                        </div>
                          <div class="row mb-3">
                            <div class="col-12 col-md-6">
                                <x-form.input_text 
                                    label="Ngày bắt đầu" 
                                    name="date_start" 
                                    type="date" 
                                    value="{{ \Carbon\Carbon::parse($combo->date_start)->format('Y-m-d') }}" />
                            </div>
                            <div class="col-12 col-md-6">
                                <x-form.input_text 
                                    label="Ngày kết thúc" 
                                    name="date_end" 
                                    type="date" 
                                    value="{{ \Carbon\Carbon::parse($combo->date_end)->format('Y-m-d') }}" />
                            </div>
                        </div>
                        <div class="form-floating mb-3">
                            <textarea class="form-control input-text-custom @error('short_description') is-invalid @enderror"
                                value="{{ old('short_description') }}" name="short_description" placeholder="Leave a comment here"
                                id="floatingTextarea" style="height: 100px"> {{ $combo->short_description }}</textarea>
                            <label for="floatingTextarea" class="text-dark-custom">Mô tả ngắn</label>
                            @error('short_description')
                                <div class="invalid-feedback">
                                    {{ $message }}
                                </div>
                            @enderror
                        </div>

                        <textarea id="description" class="input-text-custom" name="description"> {{ $combo->description }}</textarea>
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
                            @foreach ($combo->skus as $sku)
                            <div class="sku loadData p-3 border-bottom" data-sku-id="{{ $sku->id }}">
                                <div class="d-flex justify-content-between">
                                    <input hidden name="skus[]" value="{{ $sku->id }}" />
                                    <div class="content d-flex">
                                        <image class="image-sku-combo" src="{{ $sku->image_url }}" alt="{{ $sku->product->name }}" />
                                        <div class="ms-2">
                                            <p class="name-sku-combo mb-2 line-champ-2">{{ $sku->product->name }}</p>
                                            @if (isset($sku->variantValues) && $sku->variantValues->count() > 0)
                                                <span class="badge bg-secondary">
                                                    {{ implode(' - ', $sku->variantValues->pluck('value')->toArray()) }}
                                                </span>
                                            @endif
                                            <span class="price-sku-combo fs-5 d-block mt-2">{{ number_format ($sku->promotion_price, 2, '.', '.') }} VNĐ <del class="fs-6 text-neuture"> {{ number_format ($sku->price, 2, '.', '.') }} </del></span>
                                        </div>
                                    </div>
                                    <div class="button-warp ms-2">
                                        <button class="remove-sku-combo">Xóa</button>
                                    </div>
                                </div>
                            </div>
                            @endforeach
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
                            <x-form.select.option :options="$status" />
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
                            <x-form.select.option :options="$hot" />
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
                                $isChecked = $combo->categories->contains($cate->id);
                            @endphp
                            <div class="form-check mf-level" style="--cat-depth: {{ $pxMargin }}px;">
                                <input class="form-check-input" type="checkbox" name="categories[]"
                                    value="{{ $cate->id }}" id="{{ $cate->name . '-' . $cate->id }}"
                                    {{ $isChecked ? 'checked' : '' }}>
                                <label class="form-check-label text-dark-custom" for="{{ $cate->name . '-' . $cate->id }}">
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
                        <x-image.index id="image-combo" class="mb-3 img-fluid" src="{{ asset($combo->image_url) }}"
                            alt="{{ $combo->name }}" />

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
    <x-script.upload_image idPreview="image-combo" />
    <script>
        CKEDITOR.replace('description', {
            language: 'vi',
            height: 300
        });
    </script>
@endpush
