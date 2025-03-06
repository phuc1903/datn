@extends('layouts.app')

@section('content')
    <form action="{{ route('admin.role.store') }}" method="post" enctype="multipart/form-data">
        @csrf
        <div class="row card-custom">
            <div class="col-12 col-md-9">
                <div class="card card-custom mb-3">
                    <div class="card-header card-header-custom">
                        <h3 class="title">Thêm danh mục</h3>
                    </div>
                    <div class="card-body">
                        <x-form.input_text label="Tên danh mục" name="title" />
                        <x-form.input_text label="Vai trò của (Guad name)" name="guard_name" />
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
                                            <input class="form-check-input" type="checkbox" value="{{$module->id}}" id="flexCheckDefault">
                                            <label class="form-check-label" for="flexCheckDefault">
                                            {{ $module->name}}
                                            </label>
                                        </div>
                                        @foreach ($module->permissions as $permission)
                                            <div class="form-check">
                                                <input class="form-check-input" name="permission[]" type="checkbox" value="{{$permission->id}}" id="flexCheckChecked">
                                                <label class="form-check-label" for="flexCheckChecked">
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
                <div class="card mb-3">
                    <div class="card-header">
                        <h5 class="title">Trạng thái</h5>
                    </div>
                    <div class="card-body">
                        <select class="form-select selec-custom input-text-custom" aria-label="Default select example"
                            name="status">
                            {{-- @foreach ($status as $key => $sta)
                                <option value="{{ $key }}">{{ $sta }}</option>
                            @endforeach --}}
                        </select>
                    </div>
                </div>
                <div class="card mb-3">
                    <div class="card-header">
                        <h5 class="title">Hình ảnh danh mục</h5>
                    </div>
                    <div class="card-body">
                        <x-image.index id="imagePreview" class="mb-3 img-fluid" :src="config('settings.image_default')" alt="Hình ảnh danh mục" />

                        <x-button.index label="Tải ảnh" onclick="chooseImage()" />

                        <x-form.input_text hidden id="typeFile" onchange="previewImage(this);" type="file"
                            accept="image/png, image/jpeg, image/jpg" name="image" />
                    </div>
                </div>
            </div>
        </div>
    </form>
@endsection

@push('scripts')
    <x-script.upload_image idPreview="imagePreview" />
@endpush
