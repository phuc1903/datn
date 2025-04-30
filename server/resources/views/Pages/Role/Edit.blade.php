@extends('layouts.app')

@section('content')
    <form action="{{ route('admin.role.update', $role) }}" method="post" enctype="multipart/form-data">
        @csrf
        @method("PUT")
        <div class="row card-custom">
            <div class="col-12 col-md-9">
                <div class="card card-custom mb-3">
                    <div class="card-header card-header-custom">
                        <h3 class="title">Cập nhật vai trò</h3>
                    </div>
                    <div class="card-body">
                        <x-form.input_text label="Tên vai trò" name="title" value="{{ $role->title}}" placeholder="Ví dụ Quản lý bài viết, hoặc quản lý sản phẩm" />
                        <x-form.input_text label="Slug" name="name" value="{{ $role->name}}" placeholder="Ví dụ managerBlog, hoặc managerProduct" />
                        <x-form.input_text label="Vai trò của (Guad name)" name="guard_name" value="{{ $role->guard_name}}" />
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
                                            <label class="form-check-label" for="module-{{$module->id}}">
                                                {{ $module->name }}
                                            </label>
                                        </div>
                                        @foreach ($module->permissions as $permission)
                                            <div class="form-check">
                                                <input class="form-check-input module-{{$module->id}}" name="permissions[]" type="checkbox" value="{{$permission->name}}" id="permission-{{$permission->id}}"
                                                    @if(in_array($permission->name, $rolePermissions)) checked @endif>
                                                <label class="form-check-label" for="permission-{{$permission->id}}">
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
                            <x-button.index type="submit" label="Cập nhật" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
@endsection

@push('scripts')
    <x-script.upload_image idPreview="imagePreview" />
@endpush
