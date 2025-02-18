@props(['label' => '', 'type' => 'button', 'icon', 'href' => '', 'class' => '', 'id' => ''])


@if ($type == 'button')
    <button type="button" id="{{ $id }}"@class(["btn btn-primary text-white d-flex gap-2 align-items-center button", $class])>
        @if (isset($icon))
            <i class="fs-4 {{ $icon }}"></i>
        @endif
        <span>{{ $label }}</span>
    </button>
@elseif($type == 'submit')
    <button type="submit" id="{{ $id }}"@class(["btn btn-primary text-white d-flex gap-2 align-items-center button", $class])>
        @if (isset($icon))
            <i class="fs-4 {{ $icon }}"></i>
        @endif
        <span>{{ $label }}</span>
    </button>
@elseif($type == 'href')
    <a href="{{ $href }}" id="{{ $id }}"@class(["btn btn-primary text-white d-flex gap-2 align-items-center button", $class])>
        @if (isset($icon))
            <i class="fs-4 {{ $icon }}"></i>
        @endif
        <span>{{ $label }}</span>
    </a>
@endif
