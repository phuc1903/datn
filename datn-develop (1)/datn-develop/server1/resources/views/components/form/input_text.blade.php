@props(['type' => 'text', 'id' => '#', 'label' => '', 'require' => false, 'error' => '', 'value' => '', 'placeholder' => '', 'success' => ''])

<div class="mb-3">
    <div @class(["", 'input-group has-validation' => isset($error)])>
        <label for="{{ $id }}" class="form-label">{{ isset($label) && $label ? $label : '' }} </label>
        <input 
            type="{{ $type }}" 
            class="form-control input-text-custom" 
            id="{{ $id }}" 
            @if($require) required @endif
            value="{{ $value }}"
            placeholder="{{ $placeholder }}"
        >
        @if(isset($error)) 
            <div class="invalid-feedback">
                {{ $error }}
            </div>
        @endif
        @if(isset($success)) 
            <div class="valid-feedback">
                {{ $success }}
            </div>
        @endif
    </div>
</div>
