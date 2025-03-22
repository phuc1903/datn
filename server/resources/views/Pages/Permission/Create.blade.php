@extends('layouts.app')

@section('content')
    <form action="{{ route('admin.permission.store') }}" method="post" enctype="multipart/form-data">
        @csrf
        <div class="row card-custom">
            <div class="col-12 col-md-9">
                <div class="card card-custom mb-3">
                    <div class="card-header card-header-custom">
                        <h3 class="title">Thêm quyền</h3>
                    </div>
                    <div class="card-body">
                        <x-form.input_text label="Tên quyền" name="title" placeholder="Ví dụ Xem bài viết, hoặc xóa bài viết" />
                        <x-form.input_text label="Slug" name="name" placeholder="Ví dụ viewBlog, hoặc deleteBlog" />
                        <div class="mb-3">
                            <label for="guard_name" class="form-label fw-bold text-dark-custom">Chọn Guard Name</label>
                            <select class="form-select input-text-custom" name="guard_name" id="guard_name">
                                <option value="admin">Admin</option>
                                <option value="website">Website người dùng</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="module" class="form-label fw-bold text-dark-custom">Chọn Module</label>
                            <select class="form-select input-text-custom" name="module_id" id="module">
                                @foreach ($modules as $module)
                                    <option value="{{ $module->id}}">{{ $module->name }}</option>
                                @endforeach
                            </select>
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
            </div>
        </div>
    </form>
@endsection
