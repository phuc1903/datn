@extends('layouts.app')

@section('content')
    <form action="{{ route('admin.product.sku.update', $sku) }}" method="post" enctype="multipart/form-data">
        @csrf
        @method('PUT')
        <div class="row card-custom">
            <div class="col-12 col-md-9">
                <div class="card card-custom mb-3">
                    <div class="card-header card-header-custom">
                        <h3 class="title">Nhập kho sản phẩm</h3>
                    </div>
                    <div class="card-body">
                        <h3 class="text-dark-custom mb-3">{{ $sku->product->name }}</h3>
                        <span class="text-dark-custom"> {!! $sku->product->description !!}</span>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-3">
                <div class="card mb-3">
                    <div class="card-header">
                        <h5 class="title">Hành động</h5>
                    </div>
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <x-button.index type="submit" label="Nhập kho" />
                        </div>
                    </div>
                </div>
                @if(!isset($sku->variantValues))
                    <div class="card mb-3">
                        <div class="card-header">
                            <h5 class="title">Loại</h5>
                        </div>
                        <div class="card-body">
                            @foreach ($sku->variantValues as $value)
                                <span class="badge text-bg-primary text-white">{{ $value->value }}</span>
                            @endforeach
                        </div>
                    </div>
                @endif
                <div class="card mb-3">
                    <div class="card-header">
                        <h5 class="title">Kho</h5>
                    </div>
                    <div class="card-body">
                        <x-form.input_text name="quantity" disabled label="Số lượng hiện tại" value="{{ $sku->quantity}}"
                            type="number" />
                        <x-form.input_text name="quantity_new" label="Nhập thêm" value="" class="numeric" type="number" />
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
        });
    </script>

@endpush