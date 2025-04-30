@unless ($breadcrumbs->isEmpty())
    <ol class="custom-breadcrumb mb-5">
        @foreach ($breadcrumbs as $breadcrumb)
            <li class="custom-breadcrumb-item {{ $loop->last ? 'active' : '' }}">
                @if (!is_null($breadcrumb->url) && !$loop->last)
                    <a href="{{ $breadcrumb->url }}">
                        {!! $breadcrumb->icon ?? '' !!}
                        {{ $breadcrumb->title }}
                    </a>
                @else
                    <span>
                        {!! $breadcrumb->icon ?? '' !!}
                        {{ $breadcrumb->title }}
                    </span>
                @endif
                @if (!$loop->last)
                    <span class="arrow">→</span>
                @endif
            </li>
        @endforeach
    </ol>
@endunless
