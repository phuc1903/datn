@props(['id' => 0, 'label' => '', 'sideChild' => [], 'type' => ''])

@php
    $sideChildArray = json_decode($sideChild, true);
@endphp

@if ($type === 'nav')
    <li class="nav-item">
        <a class="nav-link collapsed d-flex align-items-center justify-content-between" href="#"
            data-bs-toggle="collapse" data-bs-target="#{{ $id }}" aria-expanded="false"
            aria-controls="{{ $id }}">
            <div class="flex">
                <i class="fas fa-fw fa-cog"></i>
                <span>{{ $label }}</span>
            </div>
            <i class="fas fa-chevron-down"></i>
        </a>
        <div id="{{ $id }}" class="collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionSidebar">
            <div class="bg-white py-2 collapse-inner rounded">
                <h6 class="collapse-header">Các chức năng</h6>
                @foreach ($sideChildArray as $item)
                    <a class="collapse-item" href="{{ $item['path'] ?? '#' }}">{{ $item['label'] }}</a>
                @endforeach
            </div>
        </div>
    </li>
@elseif($type === 'header')
    <div class="sidebar-heading">
        {{ $label }}
    </div>
@endif
