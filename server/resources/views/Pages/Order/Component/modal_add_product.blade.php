{{-- @props(['id']) --}}

<x-modal.index id="{{ $id }}" title="Thêm sản phẩm" buttonSecondary="true" labelSecondary="Đóng">
    <x-form.input_text name="searchProduct" />
    @foreach ($products as $product)
    <div class="d-flex justify-content-between align-items-center mb-3 border-bottom border-neuture-100 p-2 product-item-add-order rounded-2">
        <div class="d-flex align-items-center gap-2">
            <x-image.index style="width: 40px; height: 40px;" class="img-thumbnail"
                src="{{ $product->skus[0]->image_url }}" alt="{{ $product->name }}" />
            <p class="line-champ-1 fs-5 mb-0">{{ $product->name }}</p>
        </div>
        <x-button.index label="Thêm" color="secondary" id="add-product-order" data-id="{{ $product->id }}" />
    </div>
        {{-- <div class="accordion" id="accordionExample">
            <div class="accordion-item">
                <h2 class="accordion-header" id="headingOne">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#product-{{ $product->id}}"
                        aria-expanded="true" aria-controls="product-{{ $product->id}}">
                        <div class="d-flex align-items-center gap-2">
                            <x-image.index style="width: 40px; height: 40px;" class="img-thumbnail" src="{{ $product->skus[0]->image_url }}" alt="{{$product->name}}" />
                            <p class="line-champ-1 fs-5 mb-0">{{ $product->name }}</p>
                        </div>
                    </button>
                </h2>
                <div id="product-{{ $product->id}}" class="accordion-collapse collapse" aria-labelledby="headingOne"
                    data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                        a
                    </div>
                </div>
            </div>
        </div> --}}
    @endforeach




</x-modal.index>
