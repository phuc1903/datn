@extends('layouts.app')

@section('content')
    
    @endsection

    @push('scripts')
        {{ $dataTable->scripts() }}
    @endpush
