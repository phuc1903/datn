@extends('layouts.app')

@section('content')
    <form action="{{ route('admin.voucher.store') }}" method="post" enctype="multipart/form-data">
        @csrf
        <div class="row card-custom">
            <div class="col-12 col-md-9">
                <div class="card card-custom mb-3">
                    <div class="card-header card-header-custom">
                        <h3 class="title">Thêm voucher</h3>
                    </div>
                    <div class="card-body">
                        <x-form.input_text label="Tên voucher" name="title" />

                        <div class="row mb-3">
                            <div class="col-12 col-md-6">
                                <x-form.input_text label="Số lượng" name="quantity" class="numeric" type="number" />
                            </div>
                            <div class="col-12 col-md-6">
                                <label for="type" class="form-label">Chọn loại giảm</label>
                                <select class="form-select form-control @error('type') is-invalid @enderror" id="type"
                                    name="type" aria-label="Default select example">
                                    <option selected>Chọn loại giảm</option>
                                    @foreach ($type as $key => $sta)
                                        <option value="{{ $key }}" {{ old('type') == $key ? 'selected' : '' }}>{{ $sta }}</option>
                                    @endforeach
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
                                <x-form.input_text label="Giá trị giảm" name="discount_value" class="price numeric" />
                            </div>
                            <div id="max_discount_value" class="col-12 col-md-4">
                                <x-form.input_text label="Giảm tối đa" name="max_discount_value" class="price numeric value"/>
                            </div>
                            <div class="col-12 col-md-4">
                                <x-form.input_text label="Đơn hàng tối thiểu" name="min_order_value" class="price numeric" />
                            </div>
                        </div>

                        <div class="row mb-3">
                            <div class="col-12 col-md-6">
                                <x-form.input_text label="Ngày bắt đầu" name="started_date" type="date" />
                            </div>
                            <div class="col-12 col-md-6">
                                <x-form.input_text label="Ngày kết thúc" name="ended_date" type="date" />
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="description" class="form-label">Mô tả voucher (tối đa 500 ký tự)</label>
                            <textarea class="form-control @error('description') is-invalid @enderror" id="description"
                                name="description" rows="3">{{ old('description') }}</textarea>
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
            </div>
        </div>
    </form>
@endsection