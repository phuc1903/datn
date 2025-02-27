@extends('layouts.app')

@section('content')
    <form action="{{ route('admin.blog.update', $blog) }}" method="post" enctype="multipart/form-data">
        @csrf
        @method('PUT')
        <div class="row card-custom">
            <div class="col-12 col-md-9">
                <div class="card card-custom mb-3">
                    <div class="card-header card-header-custom">
                        <h3 class="title">Sửa bài viết</h3>
                    </div>
                    <div class="card-body">
                        <x-form.input_text label="Tiêu đề bài viết" name="title" value="{{ $blog->title }}" />
                        <x-form.input_text label="Slug" name="slug" value="{{ $blog->slug }}" />
                        <div class="form-floating mb-3">
                            <textarea class="form-control input-text-custom @error('short_description') is-invalid @enderror"
                                value="{{ old('short_description') }}" name="short_description" placeholder="Leave a comment here"
                                id="floatingTextarea" style="height: 100px">{{ $blog->short_description }}</textarea>
                            <label for="floatingTextarea" class="text-dark-custom">Mô tả ngắn</label>
                            @error('short_description')
                                <div class="invalid-feedback">
                                    {{ $message }}
                                </div>
                            @enderror
                        </div>
                        <textarea id="description_blog" class="input-text-custom" name="description">{{ $blog->description }}</textarea>
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
                            <option value="{{ $sta['value'] }}" selected>{{ $sta['label'] }}</option>
                            <x-form.select.option :options="$status" />
                        </select>
                    </div>
                </div>
                <div class="card mb-3">
                    <div class="card-header">
                        <h5 class="title">Ảnh đại diện bài viết</h5>
                    </div>
                    <div class="card-body">
                        <x-image.index id="image-blog" class="mb-3 img-fluid" src="{{ $blog->image_url }}"
                            alt="{{ $blog->name }}" />

                        <x-button.index label="Đổi ảnh" onclick="chooseImage()" />

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
            height: 300
        });
    </script>
@endpush
