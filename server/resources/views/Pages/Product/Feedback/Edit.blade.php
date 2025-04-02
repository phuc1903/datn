@extends('layouts.app')

@section('content')
    <form id="update-order-form" action="{{ route('admin.feedback-product.update', $feedback) }}" method="POST">
        @csrf
        @method('PUT')
        <div class="row card-custom">
            <div class="col-12 col-md-9">
                <div class="row">
                    <div class="col-12 col-md-5 mb-3">
                        <div class="card mb-3">
                            <div class="card-header">
                                <h3 class="title text-dark-custom">Thông tin đánh giá</h3>
                            </div>
                            <div class="card-body">
                                <x-form.input_text disabled label="Khách hàng" value="{{$feedback->user->first_name}}"
                                    name="name" />
                                <div class="mb-3">
                                    <label for="note" class="form-label">Nội dung đánh giá</label>
                                    <textarea class="form-control" name="note" disabled id="note"
                                        rows="3">{{ $feedback->comment }}</textarea>
                                </div>
                                <div class="mb-3">
                                    <label for="reason" class="form-label">Số sao</label>
                                    {{ $feedback->rating }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-7 mb-3">
                        <div class="card mb-3">
                            <div class="card-header">
                                <h3 class="title text-dark-custom">Sản phẩm đánh giá</h3>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-3">
                                        <x-image.index src="{{ $feedback->sku->image_url }}" />
                                    </div>
                                    <div class="col-9">
                                        <p class="text-dark-custom">{{ $feedback->sku->product->name }}</p>
                                        @if (isset($feedback->sku->variantValues) && $feedback->sku->variantValues->count() > 0)
                                            <span class="badge bg-secondary">
                                                {{ implode(' - ', $feedback->sku->variantValues->pluck('value')->toArray()) }}
                                            </span>
                                        @endif
                                        <x-button.index class="mt-3" label="Xem chi tiết" type="href" href="{{ route('admin.product.edit', $feedback->sku->product )}}" />
                                    </div>
                                </div>
                            </div>
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
                        <h5 class="title">Trạng thái đơn hàng</h5>
                    </div>
                    <div class="card-body">
                        <select class="form-select selec-custom" id="statusOrder" aria-label="Default select example"
                            name="status">
                            <option value="{{ $sta['value'] }}" selected>{{ $sta['label'] }}</option>
                            <x-form.select.option :options="$status" />
                        </select>
                    </div>
                </div>
            </div>
        </div>

    </form>
@endsection