@extends('layouts.app')

@section('content')
    <form action="{{ route('admin.role.store') }}" method="post" enctype="multipart/form-data">
        @csrf
        <div class="row card-custom">
            <div class="col-12 col-md-9">
                <div class="card card-custom mb-3">
                    <div class="card-header card-header-custom">
                        <h3 class="title">Thêm vai trò</h3>
                    </div>
                    <div class="card-body">
                        <x-form.input_text label="Tên vai trò" name="title" placeholder="Ví dụ Quản lý bài viết, hoặc quản lý sản phẩm" />
                        <x-form.input_text label="Slug" name="name" placeholder="Ví dụ managerBlog, hoặc managerProduct" />
                        <div class="mb-3">
                            <label for="guard_name" class="form-label fw-bold text-dark-custom">Chọn Guard Name</label>
                            <select class="form-select input-text-custom" name="guard_name" id="guard_name">
                                <option value="admin">Admin</option>
                                <option value="website">Website người dùng</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="card card-custom mb-3">
                    <div class="card-header">
                        <h5 class="title">Chọn quyền</h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            @foreach ($modules as $module)
                                <div class="col-4 mb-4">
                                    <div class="modules p-3">
                                        <div class="form-check mb-3">
                                            <input class="form-check-input" type="checkbox" value="{{$module->id}}" id="module-{{$module->id}}">
                                            <label class="form-check-label text-dark-custom" for="module-{{$module->id}}">
                                            {{ $module->name}}
                                            </label>
                                        </div>
                                        @foreach ($module->permissions as $permission)
                                            <div class="form-check">
                                                <input class="form-check-input module-{{$module->id}}" name="permissions[]" type="checkbox" value="{{$permission->name}}" id="permission-{{$permission->id}}">
                                                <label class="form-check-label text-dark-custom" for="permission-{{$permission->id}}">
                                                {{ $permission->title }}
                                                </label>
                                            </div>
                                        @endforeach
                                    </div>
                                </div>
                            @endforeach
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