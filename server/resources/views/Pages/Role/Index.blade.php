@extends('layouts.app')

@section('content')
    <div class="card">
        <div class="card-header d-flex justify-content-between bg-white-custom py-3 align-items-center">
            <h2 class="mb-0 text-dark-custom">Quản lý vai trò</h2>
            <div class="d-block">
                <x-button type="href" href="{{ route('admin.role.create') }}" label="Thêm vai trò" icon="bi bi-plus" />
            </div>
        </div>
        <div class="card-body table-dataTables bg-white-custom">
            <div class="table-responsive position-relative">
                {{ $dataTable->table(['class' => 'table table-striped'], true) }}
            </div>
        </div>
    </div>
@endsection

@push('scripts')
    {{ $dataTable->scripts() }}
@endpush
