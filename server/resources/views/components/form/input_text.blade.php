@props([
    'type' => 'text',
    'id' => '',
    'label' => '',
    'require' => false,
    'error' => '',
    'value' => old($name),
    'placeholder' => '',
    'success' => '',
    'name' => '',
])

<div class="mb-3">
    @if ($label)
        <label for="{{ $name }}" class="form-label fw-bold text-dark">{{ $label }}</label>
    @endif

    <input {{ $attributes}} type="{{ $type }}" name="{{ $name }}"
        class="form-control input-text-custom @error($name) is-invalid @enderror"
        id="{{ $id ?? $name }}" value="{{ $value }}" placeholder="{{ $placeholder }}"
        >

    @error($name)
        <div class="invalid-feedback">
            {{ $message }}
        </div>
    @enderror
</div>
