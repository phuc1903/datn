@extends('layouts.app')

@section('content')
    <form action="{{ route('admin.variant.update', $variant) }}" method="post">
        @csrf
        @method('PUT')
        <div class="row card-custom">
            <div class="col-12 col-md-9">
                <div class="row">
                    <div class="col-5 mb-3">
                        <div class="card">
                            <div class="card-header">
                                <h4 class="title">Thông tin chính</h4>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <x-form.input_text label="Tên thuộc tính" name="name" value="{{ $variant->name }}" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-7 mb-3">
                        <div class="card mb-3">
                            <div class="card-header">
                                <h4 class="title">Danh sách biến thể</h4>
                            </div>
                            <div class="card-body">
                                <div id="VariantValue" data-variants="{{ $variant->values }}" data-route="{{ route('admin.variant.show', $variant)}}">

                                </div>
                                <x-button.index label="Thêm biến thể" id="add_variant_value" color="outline" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-3">
                <div class="card mb-3">
                    <div class="card-header">
                        <h4 class="title">Đăng</h4>
                    </div>
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <x-button.index type="submit" label="Cập nhật" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
@endsection