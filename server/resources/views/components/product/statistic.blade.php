@props(['sku'])

<div class="card mb-3">
    <img src="{{ $sku->image_url}} " class="card-img-top" alt="{{ $sku->product->name}}">
    <div class="card-body">
        <h5 class="card-title mb-3 text-dark-custom">{{ $sku->product->name }}</h5>
        <x-product.progress percent="{{$sku->percentQuantity}}" title="Số lượng"/>
        <x-product.progress percent="{{$sku->percentFavorites}}" title="Yêu thích"/>
        <x-product.progress percent="{{$sku->percentOrders}}" title="Đơn hàng"/>
        <a href="#" class="btn btn-primary">Xem chi tiết</a>
    </div>
</div>