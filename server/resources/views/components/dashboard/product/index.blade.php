@props(['products' => [], 'title' => '', 'loading' => true])

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
            @foreach ($products as $product)
                <a class="col d-block" href="{{ route('admin.product.edit', $product->product) }}">
                    <div class="mb-3">
                        <div class="card product mb-3">
                            <x-image.index src="{{ $product->image_url }}" />
                            <div class="card-body">
                                <h5 class="card-title line-champ-3 text-dark-custom">{{ $product->product->name }}</h5>
                                <div class="variant_values mb-3">
                                    @if (isset($product->variantValues) && $product->variantValues->count() > 0)
                                        <span class="badge bg-secondary">
                                            {{ implode(' - ', $product->variantValues->pluck('value')->toArray()) }}
                                        </span>
                                    @endif
                                </div>
                                <p class="quantity">SL còn lại: <span>{{ $product->quantity }}</span></p>
                            </div>
                        </div>
                    </div>
                </a>
            @endforeach
        </div>
    @endif
</div>