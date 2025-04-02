<div class="accordion" id="addproduct">
    @foreach ($products as $product)
        <div class="accordion-item mb-3">
            <div class="accordion-header" id="header-{{ $product->id }}">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                    aria-expanded="false" data-bs-target="#collapse-{{ $product->id }}"
                    aria-controls="collapse-{{ $product->id }}">
                    <div class="d-flex gap-3 align-items-top">
                        <x-image.index class="image-product-combo" src="{{$product->skus->first()->image_url}}" />
                        <div>
                            <p class="product-title">{{ $product->name }}</p>
                            <span class="product-description line-champ-3">{{ $product->short_description }}</span>
                        </div>
                    </div>
                </button>
            </div>
            <div id="collapse-{{ $product->id }}" class="accordion-collapse collapse"
                aria-labelledby="header-{{ $product->id }}" data-bs-parent="#addproduct">
                <div class="row row-cols-4 products">
                    @foreach ($product->skus as $sku)
                    <div class="col">
                        <div class="card sku-combo">
                            <div class="form-check m-2 ms-auto">
                                <input class="form-check-input check-skus" type="checkbox" name="skus[]" value="{{$sku->id}}">
                            </div>
                            <x-image.index class="image-skus" src="{{ $sku->image_url }}" alt="{{$product->name}}" />
                            <div class="card-body">
                                <h5 class="card-title">{{ number_format($sku->promotion_price, 0, '.', '.') }}</h5>
                                <p class="card-text">{{ number_format($sku->price, 0, '.', '.') }}</p>
                                <p class="card-quantity">Số lượng: {{ $sku->quantity }}</p>
                                <x-button.index label="Xem thêm" type="href" href="{{route('admin.product.edit', $product)}}" />
                            </div>
                        </div>
                    </div>
                    @endforeach
                </div>
            </div>
        </div>
    @endforeach
</div>
