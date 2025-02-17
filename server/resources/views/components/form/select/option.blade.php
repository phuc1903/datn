@props(['options' => []]);


@foreach($options as $option)
    <option value="{{ $option['value'] }}">
        {{ $option['label'] }}
    </option>
@endforeach
