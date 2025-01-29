@php
    $sidebars = [
        [
            'id' => 1,
            'label' => "Sản phẩm",
            'path' => route('admin.product'),
            'child' => [
                [
                    'label' => 'Danh sách sản phẩm',
                    'path' => route('admin.product')
                ],
                [
                    'label' => 'Thêm sản phẩm',
                    // 'path' => route('admin.product.create')
                ],
            ]
        ],
        [
            'id' => 2,
            'label' => "Danh mục",
            // 'path' => route('admin.category'),
            'child' => [
                [
                    'label' => 'Danh sách danh mục',
                    // 'path' => route('admin.category')
                ],
                [
                    'label' => 'Thêm danh mục',
                    // 'path' => route('admin.category.create')
                ],
            ]
        ]
    ];
@endphp


<div id="sidebar">
    <div class="logo">
        <image src="" />
    </div>
    <div class="accordion" id="sidebar">
        @foreach ($sidebars as $item)
            <x-side-bar-item id="{{$item['id']}}" label="{{ $item['label'] }}" :sideChild="json_encode($item['child'])" />
        @endforeach
    </div>
</div>

