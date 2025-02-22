<div class="d-flex gap-3 h-100">

    <ul class="nav nav-tabs flex-column nav-tabs-product-custom" id="variable-product-tab" role="tablist">
        {{-- Tab Kiểm kê kho hàng --}}
        <li class="nav-item" role="presentation">
            <button class="nav-link w-100" id="warehouse-variable-tab" data-bs-toggle="tab"
                data-bs-target="#warehouse-pane-variable" type="button" role="tab"
                aria-controls="warehouse-pane-variable" aria-selected="false">Kiểm kê kho
                hàng</button>
        </li>
        {{-- Tab Các thuộc tính --}}
        <li class="nav-item" role="presentation">
            <button class="nav-link w-100" id="attributes-tab" data-bs-toggle="tab" data-bs-target="#attributes-pane"
                type="button" role="tab" aria-controls="attributes-pane" aria-selected="false">Các thuộc
                tính</button>
        </li>
        {{-- Tab Các biến thể --}}
        <li class="nav-item" role="presentation">
            <button class="nav-link w-100" id="variants-tab" data-bs-toggle="tab" data-bs-target="#variants-pane"
                type="button" role="tab" aria-controls="variants-pane" aria-selected="false">Các biến thể</button>
        </li>
    </ul>
    <div class="tab-content tab-content-product w-100" id="variable-productContent">
        {{-- Nội dung Kiểm kê kho hàng --}}
        <div class="tab-pane fade show active" id="warehouse-pane-variable" role="tabpanel"
            aria-labelledby="warehouse-variable-tab" tabindex="0">
            <div class="mb-3">
                <label for="statusWarehouse" class="form-label fw-bold text-dark-custom">Trạng
                    thái kho hàng</label>
                <select class="form-select selec-custom input-text-custom" name="statusWarehouse">
                    <x-form.select.option :options="$statusWarehouse" />
                </select>
            </div>
            <x-form.input_text label="Số lượng sản phẩm" name="quantity" />
        </div>
        {{-- Nội dung Các thuộc tính --}}
        <div class="tab-pane fade" id="attributes-pane" role="tabpanel" aria-labelledby="attributes-tab" tabindex="0">
            <div class="mb-3">
                <label for="attributes" class="form-label fw-bold text-dark-custom">Chọn các
                    thuộc tính sản phẩm</label>
                <div class="d-flex align-items-center gap-3 mb-3">
                    <select class="form-select selec-custom input-text-custom w-100" name="attributes"
                        id="getAttributes">
                        @isset($variants)
                            <x-form.select.option :options="$variants" type="default" />
                        @else
                            <option value="">Không có thuộc tính</option>
                        @endisset
                    </select>
                    <x-button.index type="button" label="Thêm" id="addAttribute" />
                </div>
                <div class="d-flex flex-column gap-3">
                    <div class="d-flex align-items-center justify-content-between border border-color p-2 rounded-1">
                        <div class="text-dark-">Kích thước</div>
                        <x-button label="Xóa" color="danger" id="delete-"/>
                    </div>
                    <div class="d-flex align-items-center justify-content-between border border-color p-2 rounded-1">
                        <div class="text-dark-">Màu</div>
                        <x-button label="Xóa" color="danger" id="delete-"/>
                    </div>
                </div>
            </div>
        </div>
        {{-- Nội dung Các biến thể --}}
        <div class="tab-pane fade" id="variants-pane" role="tabpanel" aria-labelledby="variants-tab" tabindex="0">
            
        </div>
    </div>
</div>
