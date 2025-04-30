<div class="modal fade" id="choseProducts" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Chọn sản phẩm</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <x-form.input_text label="Tìm kiếm" name="searchProductBlog" />
                <div class="product-list">
                    @foreach ($products as $product)
                        <div class="product p-3 border-bottom">
                            <div class="d-flex justify-content-between">
                                <div class="content d-flex">
                                    <x-image.index class="image-product-blog" src="{{ $product->skus->first()->image_url}}" alt="{{ $product->name}}" />
                                    <div class="ms-2">
                                        <p class="mb-2 line-champ-2 name-product-blog">{{ $product->name }}</p>
                                        <span class="description-product-blog line-champ-2 mt-2">{{ $product->short_description }}</span>
                                    </div>
                                </div>
                                <div class="button-warp ms-2">
                                    <x-button.index label="Thêm" data-product-id="{{ $product->id }}" name="add-product-blog" class="add-product-blog" />
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            </div>
        </div>
    </div>
</div>