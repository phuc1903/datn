@extends('layouts.app')

@section('content')
    <form action="{{ route('admin.product.store') }}" method="post" enctype="multipart/form-data">
        @csrf
        <div class="row card-custom">
            <div class="col-9">
                <div class="card card-custom mb-3">
                    <div class="card-header card-header-custom">
                        <h3 class="title">Thêm sản phẩm</h3>
                    </div>
                    <div class="card-body">
                        <x-form.input_text label="Tên sản phẩm" name="name" />
                        <div class="form-floating mb-3">
                            <textarea class="form-control" name="short_description" placeholder="Leave a comment here" id="floatingTextarea"
                                style="height: 100px"></textarea>
                            <label for="floatingTextarea">Mô tả ngắn</label>
                        </div>
                        <textarea id="description" name="description"></textarea>
                    </div>
                </div>
            </div>
            <div class="col-3">
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
                        <select class="form-select selec-custom" aria-label="Default select example" name="status">
                            <x-form.select.option :options="$productStatus" />
                        </select>
                    </div>
                </div>
                <div class="card mb-3">
                    <div class="card-header">
                        <h5 class="title">Sản phẩm nổi bậc</h5>
                    </div>
                    <div class="card-body">
                        <select class="form-select selec-custom" aria-label="Default select example" name="status">
                            @php
                                $hotArray = [['value' => 1, 'label' => 'Có'], ['value' => 1, 'label' => 'Không']];
                            @endphp
                            <x-form.select.option :options="$hotArray" />
                        </select>
                    </div>
                </div>
                <div class="card mb-3">
                    <div class="card-header">
                        <h5 class="title">Hình ảnh sản phẩm</h5>
                    </div>
                    <div class="card-body">
                        <x-image.index class="mb-3" />
                        <x-button.index label="Tải ảnh" />
                    </div>
                </div>
            </div>
        </div>
    </form>
@endsection

@push('scripts')
    <script src="{{ asset('ckeditor/ckeditor.js') }}"></script>
    <script>
        CKEDITOR.replace('description', {
            language: 'vi',
            height: 400
        });
    </script>
@endpush
