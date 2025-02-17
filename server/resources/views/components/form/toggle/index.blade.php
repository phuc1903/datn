@props(['label' => 'Toggle', 'id' => "#", 'name' => ''])

<div class="form-check form-switch">
    <input class="form-check-input" name="{{ $name}}" type="checkbox" id="{{ $id }}">
    <label class="form-check-label" for="{{ $id }}">{{ $label }}</label>
</div>


