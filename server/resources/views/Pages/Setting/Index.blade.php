@extends('layouts.app')

@section('content')
    <div class="row setting">
        <div class="col-8">
            <div class="card">
                <div class="card-header">
                    Thương hiệu
                </div>
                <div class="card-body">
                    <div class="d-flex gap-3">
                        <form action="">

                            <x-form.input_text label="Tên website"/>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-4">
            <div class="card">
                <div class="card-header">
                    Logo 
                </div>
                <div class="card-body">
                    <div class="d-flex flex-column gap-3 justify-content-center">
                        <x-image.index alt="test" class="avatar-setting mx-auto"/>
                        <input type="file" id="image-upload" name="image-upload" hidden>
                        <x-button.index label="Tải logo" class="mx-auto" id="upload-image" />
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
