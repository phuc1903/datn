@extends('layouts.app')

@section('content')
    <form action="{{ route('admin.voucher.update', $voucher) }}" method="post" enctype="multipart/form-data">
        @csrf
        @method('PUT')
        <div class="row card-cust

                    om">
            <div class="col-12 col-md-9">
                <div class="card card-custom mb-3">
                    <div class="card-header card-header-custom">
                        <h3 class="title">Sửa voucher</h3>
                    </div>
                    <div class="card-body">
                        <x-form.input_text label="Tên voucher" name="title" value="{{$voucher->title}}" />

                        <div class="row mb-3">
                            <div class="col-12 col-md-6">
                                <x-form.input_text label="Số lượng" name="quantity" type="number"
                                    value="{{$voucher->quantity}}" />
                            </div>
                            <div class="col-12 col-md-6">
                                <label for="type" class="form-label">Chọn loại giảm</label>
                                <select class="form-select form-control @error('type') is-invalid @enderror" id="type"
                                    name="type" aria-label="Default select example">
                                    <option value="{{ $ty['value'] }}" selected>{{ $ty['label'] }}</option>
                                    <x-form.select.option :options="$type" />
                                </select>
                                @error('type')
                                    <div class="invalid-feedback">
                                        {{ $message }}
                                    </div>
                                @enderror
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-12 col-md-4">
                                @php
                                    $class = $checkTypePercent ? "percent" : 'price';
                                @endphp
                                <x-form.input_text label="Giá trị giảm" name="discount_value" class="{{$class}}"
                                    value="{{ old('discount_value', $voucher->discount_value) }}" />
                            </div>
                            <div class="col-12 col-md-4">
                                <x-form.input_text label="Giảm tối đa" name="max_discount_value" class="price"
                                    value="{{$voucher->max_discount_value}}" />
                            </div>
                            <div class="col-12 col-md-4">
                                <x-form.input_text label="Đơn hàng tối thiểu" name="min_order_value" class="price"
                                    value="{{$voucher->min_order_value}}" />
                            </div>
                        </div>

                        <div class="row mb-3">
                            <div class="col-12 col-md-6">
                                <x-form.input_text label="Ngày bắt đầu" name="started_date" type="date"
                                    value="{{ \Carbon\Carbon::parse($voucher->started_date)->toDateString() }}" />
                            </div>
                            <div class="col-12 col-md-6">
                                <x-form.input_text label="Ngày kết thúc" name="ended_date" type="date"
                                    value="{{ \Carbon\Carbon::parse($voucher->ended_date)->toDateString() }}" />
                            </div>
                        </div>


                        <div class="mb-3">
                            <label for="description" class="form-label">Mô tả voucher (tối đa 500 ký tự)</label>
                            <textarea class="form-control @error('description') is-invalid @enderror" id="description"
                                name="description" rows="3">{{ $voucher->description }}</textarea>
                            @error('description')
                                <div class="invalid-feedback">
                                    {{ $message }}
                                </div>
                            @enderror
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
                            <option value="{{ $sta['value']}}" selected> {{ $sta['label'] }}</option>
                            <x-form.select.option :options="$status" />
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </form>
@endsection