@php
// Icon sử dụng icon của bootstrap
    $sidebars = [
        // Dashboard
        [
            'label' => 'Dashboard',
            'active' => request()->routeIs('dashboard'),
            'type' => 'nav',
            'path' => route('dashboard'),
            'icon' => "bi-bar-chart-line",
        ],
        // Title
        [
            'label' => 'Quản lý',
            'type' => 'header',
            'path' => '',
        ],
        // Quản lý sản phẩm
        [
            'label' => 'Sản phẩm',
            'active' => request()->routeIs('admin.product.index'),
            'type' => 'nav',
            'icon' => 'bi-box',
            'path' => route('admin.product.index'),
            'child' => [
                [
                    'label' => 'Danh sách sản phẩm',
                    'path' => route('admin.product.index'),
                ],
                [
                    'label' => 'Thêm sản phẩm',
                    'path' => route('admin.product.create'),
                ],
                [
                    'label' => 'Danh sách thuộc tính',
                    'path' => route('admin.variant.index'),
                ],
                [
                    'label' => 'Thêm thuộc tính',
                    'path' => route('admin.variant.create'),
                ],
            ],
        ],
        // Quản lý danh mục
        [
            'label' => 'Danh mục',
            'active' => request()->routeIs('admin.category.index'),
            'type' => 'nav',
            'icon' => 'bi-list',
            'path' => route('admin.category.index'),
            'child' => [
                [
                    'label' => 'Danh sách danh mục',
                    'path' => route('admin.category.index'),
                ],
                [
                    'label' => 'Thêm danh mục',
                    'path' => route('admin.category.create'),
                ],
            ],
        ],
        // Quản lý đơn hàng
        [
            'label' => 'Đơn hàng',
            'active' => request()->routeIs('admin.order.index'),
            'type' => 'nav',
            'icon' => 'bi-cart',
            'path' => route('admin.order.index'),
            'child' => [
                [
                    'label' => 'Danh sách đơn hàng',
                    'path' => route('admin.order.index'),
                ],
                [
                    'label' => 'Thêm đơn hàng',
                    'path' => route('admin.order.create'),
                ],
            ],
        ],
        // Quản lý đánh giá sản phẩm
        [
            'label' => 'Đánh giá sản phẩm',
            'active' => request()->routeIs('admin.feedback-product.index'),
            'type' => 'nav',
            'icon' => 'bi-star',
            'path' => route('admin.feedback-product.index'),
            'child' => [
                [
                    'label' => 'Danh sách đánh giá',
                    'path' => route('admin.feedback-product.index')
                ],
                [
                    'label' => 'Thêm đánh giá',
                    'path' => route('admin.feedback-product.create')
                ],
            ],
        ],
        // Quản lý bài viết
        [
            'label' => 'Bài viết',
            'active' => request()->routeIs('admin.blog.index'),
            'type' => 'nav',
            'icon' => 'bi-file-earmark-post',
            'path' => route('admin.blog.index'),
            'child' => [
                [
                    'label' => 'Danh bài viết',
                    'path' => route('admin.blog.index')
                ],
                [
                    'label' => 'Thêm bài viết',
                    'path' => route('admin.blog.create')
                ],
                [
                    'label' => 'DS danh mục bài viết',
                    'path' => route('admin.tag.index')
                ],
                [
                    'label' => 'Thêm danh mục',
                    'path' => route('admin.tag.create')
                ],
            ],
        ],
        // Quản lý Mã giảm giá
        [
            'label' => 'Voucher',
            'active' => request()->routeIs('admin.voucher.index'),
            'type' => 'nav',
            'icon' => 'bi-gift',
            'path' => route('admin.voucher.index'),
            'child' => [
                [
                    'label' => 'Danh sách voucher',
                    'path' => route('admin.voucher.index')
                ],
                [
                    'label' => 'Thêm voucher',
                    'path' => route('admin.voucher.create')
                ],
            ],
        ],
        // Quản lý khách hàng
        [
            'label' => 'Khách hàng',
            'active' => request()->routeIs('admin.user.index'),
            'type' => 'nav',
            'icon' => 'bi-person',
            'path' => route('admin.user.index'),
            'child' => [
                [
                    'label' => 'Danh sách khách hàng',
                    'path' => route('admin.user.index'),
                ],
                [
                    'label' => 'Thêm khách hàng',
                    'path' => route('admin.user.create'),
                ],
            ],
        ],
        // Quản lý thành viên
        [
            'label' => 'Đội ngũ',
            'active' => request()->routeIs('admin.team.index'),
            'type' => 'nav',
            'icon' => 'bi-person-lines-fill',
            'path' => route('admin.team.index'),
            'child' => [
                [
                    'label' => 'Danh sách đội ngũ',
                    'path' => route('admin.team.index'),
                ],
                [
                    'label' => 'Thêm thành viên',
                    'path' => route('admin.team.create'),
                ],
            ],
        ],
        [
            'label' => 'Slider',
            'active' => request()->routeIs('admin.slider.index'),
            'type' => 'nav',
            'icon' => 'bi-images',
            'path' => route('admin.slider.index'),
            'child' => [
                [
                    'label' => 'Danh sách Slider',
                    'path' => route('admin.slider.index'),
                ],
                [
                    'label' => 'Thêm Slide',
                    'path' => route('admin.slider.create'),
                ],
            ],
        ],
        // Cài đặt chung
        [
            'label' => 'Cài đặt chung',
            'active' => request()->routeIs('admin.setting.index'),
            'type' => 'nav',
            'icon' => 'bi-gear',
            'path' => route('admin.setting.index'),
        ],
    ];
@endphp


<ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

    <!-- Sidebar - Brand -->
    <a class="sidebar-brand d-flex align-items-center justify-content-center" href="index.html" style="height: auto">
        {{-- <div class="sidebar-brand-icon rotate-n-15"> --}}
        <div class="sidebar-brand-icon" style="width: 100%; height: 100px;">
            {{-- <i class="fas fa-laugh-wink"></i> --}}
            <image src="{{ asset('logo/image-removebg-preview.png') }}" class="logo-sideBar" style="object-fit: cover;" />
        </div>
        {{-- <div class="sidebar-brand-text mx-3">SB Admin <sup>2</sup></div> --}}
    </a>

    <!-- Divider -->
    <hr class="sidebar-divider my-0">

    <!-- Divider -->
    <hr class="sidebar-divider">

    <div class="accordion" id="sidebar">
        @foreach ($sidebars as $index => $item)
            <x-sidebar.side-bar-item id="{{ $index }}" :sidebar="$item"/>
        @endforeach
    </div>


    <!-- Divider -->
    <hr class="sidebar-divider d-none d-md-block">

    <!-- Sidebar Toggler (Sidebar) -->
    <div class="text-center d-none d-md-inline">
        <button class="rounded-circle border-0" id="sidebarToggle"></button>
    </div>

</ul>
