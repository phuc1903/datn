<div class="row h-100 w-100">
    <div class="col-3">
        <ul class="nav nav-tabs h-100 flex-column nav-tabs-product-custom" id="simple-product-tab"
            role="tablist">
            {{-- Tab Giá sản phẩm --}}
            <li class="nav-item" role="presentation">
                <button class="nav-link w-100 active" id="price-tab" data-bs-toggle="tab"
                    data-bs-target="#price-pane" type="button" role="tab"
                    aria-controls="price-pane" aria-selected="true">Giá sản phẩm</button>
            </li>
            {{-- Tab Kiểm kê kho hàng --}}
            <li class="nav-item" role="presentation">
                <button class="nav-link w-100" id="warehouse-tab" data-bs-toggle="tab"
                    data-bs-target="#warehouse-pane-simple" type="button" role="tab"
                    aria-controls="warehouse-pane-simple" aria-selected="false">Kiểm kê kho
                    hàng</button>
            </li>
        </ul>
    </div>
    <div class="col-9">
        <div class="tab-content tab-content-product" id="simple-productContent">
            {{-- Nội dung Giá sản phẩm --}}
            <div class="tab-pane fade show active" id="price-pane" role="tabpanel"
                aria-labelledby="price-tab" tabindex="0">
                <x-form.input_text label="Giá bán thường" name="price" class="price numeric" />
                <x-form.input_text label="Giá khuyến mãi" name="promotion_price" class="price numeric" />
            </div>
            {{-- Nội dung Kiểm kê kho hàng --}}
            <div class="tab-pane fade" id="warehouse-pane-simple" role="tabpanel"
                aria-labelledby="warehouse-tab" tabindex="0">
                <x-form.input_text label="Số lượng sản phẩm" name="quantity_default" class="numeric" type="number" />
            </div>
        </div>
    </div>
</div>