@extends('layouts.app')

@section('content')
    <form action="{{ route('admin.tag.update', $tag) }}" method="post" enctype="multipart/form-data">
        @csrf
        @method('PUT')
        <div class="row card-custom">
            <div class="col-12 col-md-9">
                <div class="card card-custom mb-3">
                    <div class="card-header card-header-custom">
                        <h3 class="title">Thêm bài danh mục viết</h3>
                    </div>
                    <div class="card-body">
                        <x-form.input_text label="Tên danh mục" name="name" value="{{$tag->name}}" />
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

