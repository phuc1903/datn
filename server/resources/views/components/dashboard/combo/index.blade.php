@props(['combos' => [], 'title' => '', 'loading' => true])

<div class="statistics-products mb-5">
    <h4 class="title mb-3 text-dark-custom">{{ $title }}</h4>
    
    @if($loading)
        <div class="row row-cols-1 g-3 row-cols-md-2 row-cols-lg-4">
            @foreach (range(1, 8) as $index)
                <div class="col mb-3">
                    <div class="card product mb-3 placeholder-glow">
                        <div class="row g-2">
                            <div class="col-md-4">
                                <div class="placeholder rounded-circle" style="width: 60px; height: 60px;"></div>
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <div class="placeholder col-8" style="height: 16px;"></div>
                                    <div class="placeholder col-6" style="height: 12px;"></div>
                                    <div class="placeholder col-4" style="height: 10px;"></div>
                                    <div class="placeholder col-6" style="height: 12px;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
    @else
        <div class="row row-cols-1 g-3 row-cols-md-2 row-cols-lg-4">
            @foreach ($combos as $combo)
                <a href="{{ route('admin.combo.edit', $combo) }}">
                    <div class="col mb-3">
                        <div class="card product combo mb-3" style="max-width: 540px;">
                            <div class="row g-2">
                                <div class="col-md-4">
                                    <x-image.index src="{{ $combo->image_url }}" />
                                </div>
                                <div class="col-md-8">
                                    <div class="card-body">
                                        <h5 class="card-title line-champ-3 text-dark-custom">{{ $combo->name }}</h5>
                                        <p class="quantity">SL còn lại: <span>{{ $combo->quantity }}</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            @endforeach
        </div>
    @endif
</div>
