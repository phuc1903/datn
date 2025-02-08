@props(['label' => '', 'type' => 'button', 'icon', 'href' => ''])


@if ($type == 'button')
    <button type="button" class="btn btn-primary text-white d-flex gap-2 align-items-center">
        @if ($icon)
            <i class="fs-4 {{ $icon }}"></i>
        @endif
        <span>{{ $label }}</span>
    </button>
@elseif($type == 'submit')
    <button type="submit" class="btn btn-primary text-white d-flex gap-2 align-items-center">
        @if ($icon)
            <i class="fs-4 {{ $icon }}"></i>
        @endif
        <span>{{ $label }}</span>
    </button>
@elseif($type == 'href')
    <a href="{{ $href }}" class="btn btn-primary text-white d-flex gap-2 align-items-center">
        @if ($icon)
            <i class="fs-4 {{ $icon }}"></i>
        @endif
        <span>{{ $label }}</span>
    </a>
@endif
