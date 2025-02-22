@extends('layouts.app')

@section('content')
    <div class="card card-custom bg-white-custom">
        <div class="card-header d-flex justify-content-between bg-white py-3 align-items-center">
            <h2 class="mb-0 text-dark-custom">Quản lý sản phẩm</h2>
            <div class="d-block">
                <x-button type="href" href="{{ route('admin.product.create') }}" label="Thêm sản phẩm" icon="bi bi-plus" />
            </div>
        </div>
        <div class="card-body table-dataTables">
            <div class="table-responsive position-relative">
                {{-- <div class="toggle-columns-table">
                    <div class="d-flex justify-content-end">
                        <div class="btn-group">
                            <div class="dropdown">
                                <button class="btn btn-secondary dropdown-toggle text-white" type="button"
                                    data-bs-toggle="dropdown" aria-expanded="false">
                                    Cột
                                </button>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="#">Action</a></li>
                                    <li><a class="dropdown-item" href="#">Another action</a></li>
                                    <li><a class="dropdown-item" href="#">Something else here</a></li>
                                </ul>
                            </div>
                            <div class="drop-toggle-columns dropdown-menu dropdown-menu-lg"
                                style="overflow-y: scroll; height: 210px; position: absolute; inset: 0px 0px auto auto; margin: 0px; transform: translate3d(0.5px, 38px, 0px);"
                                role="menu"></div>
                        </div>
                    </div>
                </div> --}}
                {{ $dataTable->table(['class' => 'table table-striped bg-white-custom'], true) }}
            </div>
        </div>
    </div>
@endsection

@push('scripts')
    {{ $dataTable->scripts() }}
@endpush
