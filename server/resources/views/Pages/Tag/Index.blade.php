@extends('layouts.app')

@section('content')
    <div class="card">
        <div class="card-header d-flex justify-content-between bg-white py-3 align-items-center">
            <h2 class="mb-0">Quản lý thẻ</h2>
            <div class="d-block">
                <x-button type="href" href="{{ route('admin.tag.create') }}" label="Thêm thẻ" icon="bi bi-plus" />
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
