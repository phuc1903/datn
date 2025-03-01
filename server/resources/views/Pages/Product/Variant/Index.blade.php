@extends('layouts.app')

@section('content')
    <div class="card">
        <div class="card-header d-flex justify-content-between bg-white py-3 align-items-center">
            <h2 class="mb-0">Quản lý biến thể</h2>
            <div class="d-block">
                <x-button.index type="href" color="primary" href="{{ route('admin.variant.create') }}" label="Thêm thuộc tính" icon="bi bi-plus" />
            </div>
        </div>
        <div class="card-body table-dataTables">
            <div class="table-responsive position-relative">
                {{ $dataTable->table(['class' => 'table table-striped'], true) }}
            </div>
        </div>
    </div>
@endsection

@push('scripts')
    {{ $dataTable->scripts() }}
@endpush
