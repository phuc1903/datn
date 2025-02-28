@props(['label' => '', 'type' => 'button', 'icon', 'href' => '', 'class' => '', 'id' => null, 'color' => 'primary'])

@if ($type === 'button' || $type === 'submit')
    <button {{ $attributes }}  type="{{ $type }}"
        @if (isset($id)) id="{{ $id }}" @endif 
        @class([
            'btn d-flex gap-2 align-items-center button-custom',
            $class,
            'btn-'.$color.' text-white' => $color !== 'outline',
            'btn-outline-primary btn-outline-custom' => $color === 'outline',
        ])
        
        >
        @if (isset($icon))
            <i class="fs-4 {{ $icon }}"></i>
        @endif
        <span>{{ $label }}</span>
    </button>
@else
    <a {{ $attributes }} 
        @if (isset($href) && $href) href="{{ $href }}" @endif
        @if (isset($id)) id="{{ $id }}" @endif 
        @class([
            'btn d-flex gap-2 align-items-center button-custom',
            $class,
            'btn-'.$color.' text-white' => $color !== 'outline',
            'btn-outline-primary btn-outline-custom' => $color === 'outline',
        ])>
        @if (isset($icon))
            <i class="fs-4 {{ $icon }}"></i>
        @endif
        <span>{{ $label }}</span>
    </a>
@endif
