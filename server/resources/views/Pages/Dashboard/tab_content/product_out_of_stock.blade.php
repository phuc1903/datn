<div class="tab-pane fade show active" id="{{ $id }}-pane" role="tabpanel" aria-labelledby="{{ $id }}-tab" tabindex="0">
    @if(isset($productsOutOfStock) && $productsOutOfStock->count() !== 0)
        <div class="statistic-product-outOfStock">
            @if(empty($productsOutOfStock))
                <x-dashboard.product.index title="Thống kê 8 sản phẩm sắp hết hàng" :loading="true" />
            @else
                <x-dashboard.product.index title="Thống kê 8 sản phẩm sắp hết hàng" :products="$productsOutOfStock" :loading="false" />
            @endif
        </div>
    @endif
</div>
