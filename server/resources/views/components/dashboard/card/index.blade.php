@props(['data' => [], 'loading' => true])
<div class="row row-cols-1 card-list g-3 row-cols-md-2 row-cols-lg-4">
    @foreach ($data as $statistics)
        @foreach ($statistics['data'] as $item)
            <div class="col">
                <x-dashboard.card.item title="{{ $item['title'] }}" value="{{ $item['value'] }}" :icon="$statistics['icon']" color="{{ isset($item['color']) ? $item['color'] : '' }}" loading="{{ $loading }}"/>
            </div>
        @endforeach
    @endforeach
</div>
