@props(['id' => 0,'label' => '', 'sideChild' => []])

@php
    $sideChildArray = json_decode($sideChild, true);
@endphp

<div class="accordion-item">
    <h2 class="accordion-header" id="headingOne">
        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-{{$id}}"
            aria-expanded="true" aria-controls="collapse-{{$id}}">
            <i class="bi bi-1-circle-fill mr-2 d-block"></i>
            {{ $label }}
        </button>
    </h2>
    <div id="collapse-{{$id}}" class="accordion-collapse collapse show" aria-labelledby="heading-{{$id}}"
        data-bs-parent="#accordionExample">
        <div class="accordion-body p-0">
            @if (!empty($sideChildArray))
                @foreach ($sideChildArray as $item)
                    <a class="text-white bg-primary d-block p-4" href="{{ $item['path'] ?? "" }}">{{ $item['label'] }}</a>
                @endforeach
            @endif
        </div>
    </div>
</div>
