@props(['id' => 0, 'sidebar', 'label' => '', 'sideChild' => [], 'type' => ''])


@if ($sidebar['type'] === 'nav')
    <div @class([
        'accordion-item nav-item bg-transparent border-0',
        'active' => $sidebar['active'],
        'no-button' => !isset($sidebar['child'])
    ])>
        <a href="{{ isset($sidebar['child']) ? '#' : $sidebar['path'] }}"
            class="accordion-header bg-transparent text-decoration-none color-white" id="heading{{ $id }}">
            <button class="accordion-button accordion-button-custom bg-transparent text-white collapsed" type="button"
                data-bs-toggle="collapse" data-bs-target="#collapse{{ $id }}" aria-expanded="false"
                aria-controls="collapse{{ $id }}">
                <i id="accordion-icon" class="bi {{ $sidebar['icon']}} me-2 text-white"></i>
                <span class="d-block">{{ $sidebar['label'] }}</span>
            </button>
        </a>
        @if (isset($sidebar['child']))
            <div id="collapse{{ $id }}" class="accordion-collapse collapse my-3" aria-labelledby="heading{{ $id }}"
                data-bs-parent="#accordionSidebar">
                <div class="accordion-body bg-white py-2 collapse-inner rounded">
                    @foreach ($sidebar['child'] as $item)
                        @if(!isset($item['permission_required']) || auth()->user()->can($item['permission_required']))
                        <a class="d-block text-decoration-none py-2 px-3 text-body my-2 sidebar-children"
                            href="{{ $item['path'] ?? '#' }}">
                            {{ $item['label'] }}
                        </a>
                        @endif
                    @endforeach
                </div>
            </div>
        @endif
    </div>
@elseif($sidebar['type'] === 'header')
    <div class="sidebar-heading">
        {{ $sidebar['label'] }}
    </div>
@endif