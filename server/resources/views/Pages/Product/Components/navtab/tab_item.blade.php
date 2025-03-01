@props(['active' => false])

<li class="nav-item" role="presentation">
    <button class="nav-link w-100 @if ($active) {{$active}} @endif" id="{{ $id }}" data-bs-toggle="tab"
        data-bs-target="#{{ $id }}" type="button" role="tab" aria-controls="{{ $id }}"
        aria-selected="true">{{ $label }}</button>
</li>