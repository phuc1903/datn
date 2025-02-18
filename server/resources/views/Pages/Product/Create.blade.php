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
                <div class="card card-custom mb-3">
                    <div class="card-header">
                        <h5 class="title">Dữ liệu sản phẩm</h5>
                    </div>
                    <div class="card-body">
                        <ul class="nav nav-tabs" id="myTab" role="tablist">
                            <li class="nav-item" role="presentation">
                                <button class="nav-link active" id="home-tab" data-bs-toggle="tab"
                                    data-bs-target="#product-default" type="button" role="tab"
                                    aria-controls="product-default" aria-selected="true">Sản phẩm đơn giản</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="profile-tab" data-bs-toggle="tab"
                                    data-bs-target="#product-variants" type="button" role="tab"
                                    aria-controls="product-variants" aria-selected="false">Sản phẩm có biến thể</button>
                            </li>
                        </ul>
                        <div class="tab-content" id="myTabContent">
                            <div class="tab-pane fade show active" id="product-default" role="tabpanel"
                                aria-labelledby="home-tab" tabindex="0">...</div>
                            <div class="tab-pane fade" id="product-variants" role="tabpanel" aria-labelledby="profile-tab"
                                tabindex="0">...</div>
                        </div>
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
            height: 300
        });
    </script>
@endpush
