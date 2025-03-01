@props(['options' => [], 'type' => 'enum'])

@if ($type === 'enum')
    @foreach ($options as $option)
        <option value="{{ $option['value'] }}">
            {{ $option['label'] }}
        </option>
    @endforeach
@elseif($type === 'default')
    @foreach ($options as $option)
        <option value="{{ $option->id }}">
            {{ $option->name }}
        </option>
    @endforeach
@endif