@props(['option' => []])

{{-- Mẫu --}}
{{-- @php
    $options = [
        [
            'value' => 'ádasdas',
            'selected' => true,
        ],
        [
            'value' => 'adasdasd',
            'selected' => false,
        ],
    ];
@endphp --}}

<select class="form-select selec-custom" aria-label="Default select example">
    @foreach($options as $option)
        <option value="{{ $option['value'] }}" @if($option['selected']) selected @endif>
            {{ $option['value'] }}
        </option>
    @endforeach
</select>
