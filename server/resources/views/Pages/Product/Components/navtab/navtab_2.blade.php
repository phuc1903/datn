<div class="row h-100 w-100">
    <div class="col-3">
        <ul class="nav nav-tabs flex-column nav-tabs-product-custom h-100" id="variable-product-tab" role="tablist">
            {{-- Tab Kiểm kê kho hàng --}}
            <li class="nav-item" role="presentation">
                <button class="nav-link w-100 active" id="warehouse-variable-tab" data-bs-toggle="tab"
                    data-bs-target="#warehouse-pane-variable" type="button" role="tab"
                    aria-controls="warehouse-pane-variable" aria-selected="false">Kiểm kê kho
                    hàng</button>
            </li>
            {{-- Tab Các thuộc tính --}}
            <li class="nav-item" role="presentation">
                <button class="nav-link w-100" id="attributes-tab" data-bs-toggle="tab"
                    data-bs-target="#attributes-pane" type="button" role="tab" aria-controls="attributes-pane"
                    aria-selected="false">Các thuộc
                    tính</button>
            </li>
            {{-- Tab Các biến thể --}}
            <li class="nav-item" role="presentation">
                <button class="nav-link w-100" id="variants-tab" data-bs-toggle="tab" data-bs-target="#variants-pane"
                    type="button" role="tab" aria-controls="variants-pane" aria-selected="false">Các biến
                    thể</button>
            </li>
        </ul>

    </div>
    <div class="col-9">
        <div class="tab-content tab-content-product" id="variable-productContent">
            {{-- Nội dung Kiểm kê kho hàng --}}
            <div class="tab-pane fade show active" id="warehouse-pane-variable" role="tabpanel"
                aria-labelledby="warehouse-variable-tab" tabindex="0">
                {{-- <div class="mb-3">
                    <label for="statusWarehouse" class="form-label fw-bold text-dark-custom">Trạng
                        thái kho hàng</label>
                    <select class="form-select selec-custom input-text-custom" name="statusWarehouse">
                        <x-form.select.option :options="$statusWarehouse" />
                    </select>
                </div> --}}
                <x-form.input_text label="Số lượng sản phẩm" name="quantity" class="numeric" type="number" />
            </div>
            {{-- Nội dung Các thuộc tính --}}
            <div class="tab-pane fade" id="attributes-pane" role="tabpanel" aria-labelledby="attributes-tab"
                tabindex="0">
                <div class="mb-3">
                    <label for="product-attributes" class="form-label text-dark-custom">Chọn thuộc tính</label>
                    <div class="d-flex gap-3">
                        <select class="form-select" id="product-attributes">
                            @foreach ($variants as $vari)
                                <option value="{{ $vari->id }}" data-vari='@json($vari)'>
                                    {{ $vari->name }}</option>
                            @endforeach
                        </select>
                        <x-button.index id="add-attribute" label="Thêm" />
                    </div>
                </div>

                <div class="accordion mt-4 d-flex flex-column gap-3" id="attribute-list"></div>

                <button type="button" class="btn btn-success mt-3" id="save-attributes">Lưu thuộc tính</button>

            </div>
            {{-- Nội dung Các biến thể --}}
            <div class="tab-pane fade" id="variants-pane" role="tabpanel" aria-labelledby="variants-tab">
                <button type="button" class="btn btn-primary mt-3" id="generate-variants">Tạo biến thể từ tất cả thuộc
                    tính</button>
         
                <div class="accordion mt-4" id="variant-list">
                    <!-- Danh sách biến thể sẽ được thêm vào đây -->
                </div>
            </div>

        </div>
    </div>
</div>
