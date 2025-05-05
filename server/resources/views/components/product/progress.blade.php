@props(['title','percent' => 0, 'value' => 0])

<div class="d-flex gap-2">
    <span class="text-dark-custom text-nowrap">{{$title}}</span>
    <div class="progress mb-3 w-100">
        <div class="progress-bar bg-primary progress-bar-striped progress-bar-animated" role="progressbar"
            aria-label="Animated striped example" aria-valuenow="{{ $percent }}" aria-valuemin="0"
            aria-valuemax="100" style="width: {{$percent}}%">{{ $percent}}%</div>
    </div>
    <span class="text-secondary">{{$value}}</span>
</div>