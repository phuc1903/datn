@props(['icon' => null, 'title' => '', 'value' => '', 'color' => 'primary', 'loading' => true])


@if($loading)
<div class="card-item w-100 placeholder-wave" aria-hidden="true">
    <div class="item {{ $color }} d-flex align-items-center gap-3 p-3">
        <div class="placeholder rounded-circle" style="width: 48px; height: 48px;"></div>
        <div class="content d-flex flex-column gap-2 w-100">
            <div class="placeholder col-8" style="height: 16px;"></div>
            <div class="placeholder col-6" style="height: 12px;"></div>
        </div>
    </div>
</div>
@else
    <div class="card-item w-100 placeholder-glow">
        <div class="item {{ $color }} d-flex gap-3 placeholder-glow">
            <div class="icon">
                {!! !empty($icon)
                    ? $icon
                    : '
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
                        class="bi bi-calendar-date" viewBox="0 0 16 16">
                        <path
                            d="M6.445 11.688V6.354h-.633A13 13 0 0 0 4.5 7.16v.695c.375-.257.969-.62 1.258-.777h.012v4.61zm1.188-1.305c.047.64.594 1.406 1.703 1.406 1.258 0 2-1.066 2-2.871 0-1.934-.781-2.668-1.953-2.668-.926 0-1.797.672-1.797 1.809 0 1.16.824 1.77 1.676 1.77.746 0 1.23-.376 1.383-.79h.027c-.004 1.316-.461 2.164-1.305 2.164-.664 0-1.008-.45-1.05-.82zm2.953-2.317c0 .696-.559 1.18-1.184 1.18-.601 0-1.144-.383-1.144-1.2 0-.823.582-1.21 1.168-1.21.633 0 1.16.398 1.16 1.23" />
                        <path
                            d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                    </svg>' !!}
            </div>
            <div class="content d-flex flex-column gap-1">
                <span class="value line-champ-1 text-dark-custom">{{ number_format($value, 0, '.', '.') }}</span>
                <h4 class="title line-champ-1">{{ $title }}</h4>
            </div>
        </div>
    </div>
@endif


