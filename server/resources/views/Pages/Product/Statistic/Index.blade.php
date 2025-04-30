@extends('layouts.app')

@section('content')
    <div class="card card-custom bg-white-custom">
        <div class="card-header d-flex justify-content-between bg-white-custom py-3 align-items-center">
            <h2 class="mb-0 text-dark-custom">Thống kê sản phẩm</h2>
            <div class="d-block">
                <x-button type="href" href="{{ route('admin.product.create') }}" label="Thêm sản phẩm" icon="bi bi-plus" />
            </div>
        </div>
        <div class="card-body table-dataTables bg-white-custom">
            <div class="row">
                @foreach ($skus as $sku)
                    <div class="col-3">
                        <x-product.statistic :sku="$sku" />
                    </div>
                @endforeach
                <div class="mt-3">
                    {{ $skus->links('pagination::bootstrap-5') }}
                </div>
            </div>
        </div>
    </div>
@endsection