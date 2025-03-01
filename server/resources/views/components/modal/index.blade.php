@props(['id', 'title' => '', 'buttonPrimary' => false, 'buttonSecondary' => true, 'labelPrimary', 'labelSecondary'])

<div class="modal fade" id="{{ $id }}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">{{ $title }}</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                {{ $slot }}
            </div>
            <div class="modal-footer">
                @if ($buttonSecondary)
                    <x-button.index color="danger" label="{{ $labelSecondary }}" data-bs-dismiss="modal" />
                @endif
                @if ($buttonPrimary)
                    <x-button.index color="primary" label="{{ $labelPrimary }}" />
                @endif
            </div>
        </div>
    </div>
</div>
