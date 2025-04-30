@extends('layouts.app')

@section('content')
    <div class="card">
        <div class="card-header d-flex justify-content-between bg-white-custom py-3 align-items-center">
            <h2 class="mb-0 text-dark-custom">Quản lý đơn hàng</h2>
        </div>
        <div class="card-body table-dataTables bg-white-custom">
            @include("Pages.Order.Component.Location")
            <div class="table-responsive position-relative">
                {{ $dataTable->table(['class' => 'table table-striped'], true) }}
            </div>
        </div>
    </div>
@endsection

@push('scripts')
    {{ $dataTable->scripts() }}
@endpush
