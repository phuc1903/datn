@extends('layouts.app')

@section('content')
    <form action="{{ route('admin.blog.store') }}" method="post" enctype="multipart/form-data">
        @csrf
        <div class="row card-custom">
            <div class="col-12 col-md-9">
                <div class="card card-custom mb-3">
                    <div class="card-header card-header-custom">
                        <h3 class="title">Thêm bài viết</h3>
                    </div>
                    <div class="card-body">
                        <x-form.input_text label="Tiêu đề bài viết" name="title" id="name" />
                        <x-form.input_text label="Slug" name="slug" id="slug" />
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
                        <textarea id="description_blog" class="input-text-custom @error('short_description') is-invalid @enderror" name="description">{{ old('description') }}</textarea>
                        @error('description')
                                <div class="invalid-feedback">
                                    {{ $message }}
                                </div>
                            @enderror
                    </div>
                </div>
                <div class="card card-custom mb-3">
                    <div class="card-header">
                        <h3 class="title">Chọn sản phẩm gắn vào bài viết</h3>
                    </div>
                    <div class="card-body p-3">
                        <div class="row row-cols-1 g-3 row-cols-md-2 row-cols-lg-4">
                            @foreach ($products as $product)
                                <div class="col">
                                    <div class="card product-blog product mb-3 sku-combo">
                                        <div class="form-check m-2 ms-auto">
                                            <input class="form-check-input check-skus" type="checkbox" name="products[]" value="{{$product->id}}">
                                        </div>
                                        <x-image.index class="mb-3" src="{{ $product->skus->first()->image_url }}" />
                                        <div class="card-body">
                                            <h5 class="card-title line-champ-3 text-dark-custom mb-2">{{ $product->name }}</h5>
                                            <x-button.index label="Xem chi tiết" type='href' href="{{ route('admin.product.edit', $product) }}" />
                                        </div>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                        {{ $products->links('pagination::bootstrap-5') }}
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
                        <h5 class="title">Chọn danh mục bài viết</h5>
                    </div>
                    <div class="card-body">
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
                        <h5 class="title">Ảnh đại diện bài viết</h5>
                    </div>
                    <div class="card-body">
                        <x-image.index id="image-blog" class="mb-3 img-fluid" :src="config('settings.image_default')"
                            alt="Hình ảnh danh mục" />

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
    <x-script.upload_image idPreview="image-blog" />
    <script>
        CKEDITOR.replace('description_blog', {
            language: 'vi',
            height: 800
        });
    </script>
@endpush
