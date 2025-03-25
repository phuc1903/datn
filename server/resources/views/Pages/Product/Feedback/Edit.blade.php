@extends('layouts.app')

@section('content')
    <form id="update-order-form" action="{{ route('admin.feedback-product.update', $feedback) }}" method="POST">
        @csrf
        @method('PUT')
        <div class="row card-custom">
            <div class="col-12 col-md-9">
                <div class="card mb-3">
                    <div class="card-header">
                        <h3 class="title">Thông tin đơn hàng</h3>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-12 col-md-6">
                                <x-form.input_text disabled label="Khách hàng" value="{{$feedback->user->first_name}}" name="name" />
                                <div class="mb-3">
                                    <label for="note" class="form-label">Nội dung đánh giá</label>
                                    <textarea class="form-control" name="note" disabled id="note" rows="3">{{ $feedback->comment }}</textarea>
                                </div>
                                <div class="mb-3">
                                    <label for="reason" class="form-label">Số sao</label>
                                    {{ $feedback->rating }}
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
