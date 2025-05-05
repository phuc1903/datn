@props(['sku'])

<div class="card mb-3">
    <img src="{{ $sku->image_url}} " class="card-img-top" alt="{{ $sku->product->name}}">
    <div class="card-body">
        <h6 class="card-title mb-3 text-dark-custom">{{ $sku->product->name }}</h6>
        <x-product.progress percent="{{$sku->percentQuantity}}" title="Số lượng" value="{{$sku->quantity}}"/>
        <x-product.progress percent="{{$sku->percentFavorites}}" title="Yêu thích" value="{{$sku->quantityFavorites}}"/>
        <x-product.progress percent="{{$sku->percentOrders}}" title="Đơn hàng" value="{{$sku->quantityOrders}}"/>
        <x-button.index label="Chi tiết" type="href" href="{{ route('admin.product.show', $sku)}}" />
    </div>
</div>