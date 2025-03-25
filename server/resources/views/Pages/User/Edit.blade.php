@extends('layouts.app')

@section('content')
    <form action="{{ route('admin.user.update', $user) }}" method="post" enctype="multipart/form-data">
        @csrf
        @method("PUT")
        <div class="row card-custom">
            <div class="col-12 col-md-9">
                <div class="row">
                    <div class="col-12 col-md-5 mb-3">
                        <div class="card">
                            <div class="card-header">
                                <h4 class="title">Thông tin chính</h4>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <x-form.input_text label="Họ" disabled name="last_name" value="{{$user->last_name}}" />
                                    <x-form.input_text label="Tên" disabled value="{{$user->first_name}}"
                                        name="first_name" />
                                    <x-form.input_text label="Email" disabled value="{{$user->email}}" name="email"
                                        type="email" />
                                    <x-form.input_text label="Số điện thoại" disabled value="{{$user->phone_number}}"
                                        name="phone_number" />
                                    <div class="mb-3">
                                        <label for="sex" class="form-label">Giới tính </label>
                                        <select class="form-select w-100" disabled aria-label="User Sex" id="sex"
                                            name="sex">
                                            <option value="{{ $sexActiveValue }}" selected>{{ $sexActive }}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-7 mb-3 user-feedback">
                        <div class="card mb-3">
                            <div class="card-header">
                                <h4 class="title">Đánh giá gần đây</h4>
                            </div>
                            <div class="card-body">
                                <div class="user-rating d-flex flex-column gap-5">
                                    @foreach ($user->productFeedbacks as $feedback)
                                        <div class="rating-item p-3">
                                            <div class="top mb-3">
                                                <div class="d-flex justify-content-between gap-5">
                                                    <div class="d-flex gap-1">
                                                        <x-image.index class="image-user-product-fb"
                                                            src="{{$feedback->sku->image_url}}" />
                                                        <div class="d-flex flex-column gap-2">
                                                            <p class="text-dark-custom m-0">{{ $feedback->sku->product->name }}</p>
                                                            @if (isset($feedback->sku->variantValues) && $feedback->sku->variantValues->count() > 0)
                                                                <span class="badge bg-secondary w-">
                                                                    @foreach ($feedback->sku->variantValues as $value)
                                                                        {{$value->value}}
                                                                    @endforeach
                                                                </span>
                                                            @endif
                                                        </div>
                                                    </div>
                                                    <div class="d-flex gap-1 stars">
                                                        @for ($i = 1; $i <= 5; $i++)
                                                            <i
                                                                class="bi bg bi-star{{ $i <= intval($feedback->rating) ? '-fill' : '' }}"></i>
                                                        @endfor
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="bottom">
                                                <span>Nội dung: {{ $feedback->comment}}</span>
                                            </div>
                                        </div>
                                    @endforeach
                                </div>
                                {{-- <div id="address-books" data-addresses="{{$user->addresses}}">
                                </div>
                                <x-button.index label="Thêm địa chỉ" id="add_address" color="outline" /> --}}
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
                        <x-button.index type="submit" label="Cập nhật trạng thái" />
                    </div>
                </div>
                <div class="card mb-3">
                    <div class="card-header">
                        <h4 class="title">Trạng thái</h4>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <select class="form-select w-100" aria-label="User Sex" id="status" name="status">
                                <option value="{{ $statusActiveValue }}" selected>{{ $statusActive }}</option>
                                <x-form.select.option :options="$statusList" />
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
@endsection