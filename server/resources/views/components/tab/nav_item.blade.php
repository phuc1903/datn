@props(['id' => '', 'active' => false, 'label' => ""])

<li class="nav-item" role="presentation">
    <button class="nav-link {{ $active ? 'active' : '' }}" 
            id="{{ $id }}-tab" 
            data-bs-toggle="tab" 
            data-bs-target="#{{ $id }}-pane" 
            type="button" 
            role="tab" 
            aria-controls="{{ $id }}-pane" 
            aria-selected="true">
        {{ $label }}
    </button>
</li>
