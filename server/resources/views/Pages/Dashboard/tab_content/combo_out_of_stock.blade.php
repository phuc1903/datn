<div class="tab-pane fade" id="{{ $id }}-pane" role="tabpanel" aria-labelledby="{{ $id }}-tab" tabindex="0">
    @if(isset($combosOutOfStock) && $combosOutOfStock->count() !== 0)
        <div class="statistic-product-outOfStock">
            @if(empty($combosOutOfStock))
                <x-dashboard.combo.index title="Thống kê 8 combo bán chạy" :loading="true" />
            @else
                <x-dashboard.combo.index title="Thống kê 8 combo bán chạy" :combos="$combosOutOfStock" :loading="false" />
            @endif
        </div>
    @endif
</div>
