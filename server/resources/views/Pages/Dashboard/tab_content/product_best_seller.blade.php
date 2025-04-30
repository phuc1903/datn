<div class="tab-pane fade" id="{{ $id }}-pane" role="tabpanel" aria-labelledby="{{ $id }}-tab" tabindex="0">
    @if(isset($productBestSeller) && $productBestSeller->count() !== 0)
        <div class="statistic-product-outOfStock">
            @if(empty($productBestSeller))
                <x-dashboard.product.index title="Thống kê 8 sản phẩm bán chạy" :loading="true" />
            @else
                <x-dashboard.product.index title="Thống kê 8 sản phẩm bán chạy" :products="$productBestSeller" :loading="false" />
            @endif
        </div>
    @endif
</div>
