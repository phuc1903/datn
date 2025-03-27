<div class="modal fade" id="choseSkus" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content bg-white-custom">
            <div class="modal-header">
                <h1 class="modal-title fs-5 text-dark-custom" id="exampleModalLabel">Chọn sản phẩm</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <x-form.input_text label="Tìm kiếm" name="searchProductBlog" />
                <div class="sku-list">
                    @foreach ($skus as $sku)
                        <div class="sku p-3 border-bottom">
                            <div class="d-flex justify-content-between">
                                <div class="content d-flex">
                                    <x-image.index class="image-sku-combo" src="{{ $sku->image_url}}" alt="{{ $sku->product->name}}" />
                                    <div class="ms-2">
                                        <p class="mb-2 line-champ-2 name-sku-combo text-dark-custom">{{ $sku->product->name }}</p>
                                        @if (isset($sku->variantValues) && $sku->variantValues->count() > 0)
                                            <span class="badge bg-secondary variant-values">
                                                {{ implode(' - ', $sku->variantValues->pluck('value')->toArray()) }}
                                            </span>
                                        @endif
                                        <span class="price-sku-combo fs-5 d-block mt-2 text-dark-custom">{{ number_format ($sku->promotion_price, 2, '.', '.') }} VNĐ <del class="fs-6 text-neuture"> {{ number_format ($sku->price, 2, '.', '.') }} </del></span>
                                    </div>
                                </div>
                                <div class="button-warp ms-2">
                                    <x-button.index label="Thêm" data-sku-id="{{ $sku->id }}" name="add-sku-combo" class="add-sku-combo" />
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                {{-- <button type="button" class="btn btn-primary">Save changes</button> --}}
            </div>
        </div>
    </div>
</div>