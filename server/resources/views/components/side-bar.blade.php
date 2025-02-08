@php
    $sidebars = [
        [
            'id' => 1,
            'label' => 'Tổng quan',
            'type' => 'header',
            'path' => '',
            'child' => [],
        ],
        [
            'id' => 2,
            'label' => 'Sản phẩm',
            'type' => 'nav',
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
            ],
        ],
        [
            'id' => 3,
            'label' => 'Danh mục',
            'type' => 'nav',
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
        [
            'id' => 4,
            'label' => 'Đơn hàng',
            'type' => 'header',
            'path' => '',
            'child' => [],
        ],
        [
            'id' => 5,
            'label' => 'Đơn hàng',
            'type' => 'nav',
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
        [
            'id' => 6,
            'label' => 'Đánh giá',
            'type' => 'nav',
            // 'path' => route('admin.category'),
            'child' => [
                [
                    'label' => 'Danh sách đánh giá',
                    // 'path' => route('admin.category')
                ],
                [
                    'label' => 'Thêm đánh giá',
                    // 'path' => route('admin.category.create')
                ],
            ],
        ],
        [
            'id' => 7,
            'label' => 'Tài khoản',
            'type' => 'header',
            'path' => '',
            'child' => [],
        ],
        [
            'id' => 8,
            'label' => 'Khách hàng',
            'type' => 'nav',
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
        [
            'id' => 9,
            'label' => 'Đội ngũ',
            'type' => 'nav',
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

    <!-- Nav Item - Dashboard -->
    <li class="nav-item active">
        <a class="nav-link" href="{{ route('dashboard') }}">
            <i class="fas fa-fw fa-tachometer-alt"></i>
            <span>Dashboard</span></a>
    </li>

    <!-- Divider -->
    <hr class="sidebar-divider">

    <!-- Heading -->
    {{-- <div class="sidebar-heading">
        Interface
    </div> --}}


    @foreach ($sidebars as $item)
        <x-side-bar-item id="{{ $item['id'] }}" type="{{ $item['type'] }}" label="{{ $item['label'] }}"
            :sideChild="json_encode($item['child'])" />
    @endforeach

    {{-- <!-- Nav Item - Product -->
    <li class="nav-item">
        <a class="nav-link collapsed d-flex align-items-center justify-content-between" href="#"
            data-bs-toggle="collapse" data-bs-target="#product" aria-expanded="false" aria-controls="product">
            <div class="flex">
                <i class="fas fa-fw fa-cog"></i>
                <span>Sản phẩm</span>
            </div>
            <i class="fas fa-chevron-down"></i>
        </a>
        <div id="product" class="collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionSidebar">
            <div class="bg-white py-2 collapse-inner rounded">
                <h6 class="collapse-header">Các chức năng</h6>
                <a class="collapse-item" href="buttons.html">Danh sách sản phẩm</a>
                <a class="collapse-item" href="cards.html">Thêm sản phẩm</a>
                <a class="collapse-item" href="cards.html">Danh sách danh mục</a>
                <a class="collapse-item" href="cards.html">Thêm danh mục</a>
            </div>
        </div>
    </li>

    <!-- Nav Item - Category -->
    <li class="nav-item">
        <a class="nav-link collapsed d-flex align-items-center justify-content-between" href="#"
            data-bs-toggle="collapse" data-bs-target="#category" aria-expanded="false" aria-controls="category">
            <div class="flex">
                <i class="fas fa-fw fa-cog"></i>
                <span>Danh mục</span>
            </div>
            <i class="fas fa-chevron-down"></i>
        </a>
        <div id="category" class="collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionSidebar">
            <div class="bg-white py-2 collapse-inner rounded">
                <h6 class="collapse-header">Các chức năng</h6>
                <a class="collapse-item" href="buttons.html">Danh sách sản phẩm</a>
                <a class="collapse-item" href="cards.html">Thêm sản phẩm</a>
                <a class="collapse-item" href="cards.html">Danh sách danh mục</a>
                <a class="collapse-item" href="cards.html">Thêm danh mục</a>
            </div>
        </div>
    </li>

    <!-- Nav Item - Voucher -->
    <li class="nav-item">
        <a class="nav-link collapsed d-flex align-items-center justify-content-between" href="#"
            data-bs-toggle="collapse" data-bs-target="#voucher" aria-expanded="false" aria-controls="voucher">
            <div class="flex">
                <i class="fas fa-fw fa-cog"></i>
                <span>Voucher</span>
            </div>
            <i class="fas fa-chevron-down"></i>
        </a>
        <div id="voucher" class="collapse" aria-labelledby="voucher" data-bs-parent="#accordionSidebar">
            <div class="bg-white py-2 collapse-inner rounded">
                <h6 class="collapse-header">Các chức năng</h6>
                <a class="collapse-item" href="buttons.html">Danh sách sản phẩm</a>
                <a class="collapse-item" href="cards.html">Thêm sản phẩm</a>
                <a class="collapse-item" href="cards.html">Danh sách danh mục</a>
                <a class="collapse-item" href="cards.html">Thêm danh mục</a>
            </div>
        </div>
    </li>

    <!-- Nav Item - Blog -->
    <li class="nav-item">
        <a class="nav-link collapsed d-flex align-items-center justify-content-between" href="#"
            data-bs-toggle="collapse" data-bs-target="#blog" aria-expanded="false" aria-controls="blog">
            <div class="flex">
                <i class="fas fa-fw fa-cog"></i>
                <span>Blog</span>
            </div>
            <i class="fas fa-chevron-down"></i>
        </a>
        <div id="blog" class="collapse" aria-labelledby="blog" data-bs-parent="#accordionSidebar">
            <div class="bg-white py-2 collapse-inner rounded">
                <h6 class="collapse-header">Các chức năng</h6>
                <a class="collapse-item" href="buttons.html">Danh sách sản phẩm</a>
                <a class="collapse-item" href="cards.html">Thêm sản phẩm</a>
                <a class="collapse-item" href="cards.html">Danh sách danh mục</a>
                <a class="collapse-item" href="cards.html">Thêm danh mục</a>
            </div>
        </div>
    </li>
    <!-- Divider -->
    <hr class="sidebar-divider">

    <!-- Heading -->
    <div class="sidebar-heading">
        Addons
    </div>

    <!-- Nav Item - Order -->
    <li class="nav-item">
        <a class="nav-link collapsed d-flex align-items-center justify-content-between" href="#"
            data-bs-toggle="collapse" data-bs-target="#order" aria-expanded="false" aria-controls="order">
            <div class="flex">
                <i class="fas fa-fw fa-cog"></i>
                <span>Đơn hàng</span>
            </div>
            <i class="fas fa-chevron-down"></i>
        </a>
        <div id="order" class="collapse" aria-labelledby="order" data-bs-parent="#accordionSidebar">
            <div class="bg-white py-2 collapse-inner rounded">
                <h6 class="collapse-header">Các chức năng</h6>
                <a class="collapse-item" href="buttons.html">Danh sách sản phẩm</a>
                <a class="collapse-item" href="cards.html">Thêm sản phẩm</a>
                <a class="collapse-item" href="cards.html">Danh sách danh mục</a>
                <a class="collapse-item" href="cards.html">Thêm danh mục</a>
            </div>
        </div>
    </li>

    <!-- Nav Item - Review -->
    <li class="nav-item">
        <a class="nav-link collapsed d-flex align-items-center justify-content-between" href="#"
            data-bs-toggle="collapse" data-bs-target="#review" aria-expanded="false" aria-controls="review">
            <div class="flex">
                <i class="fas fa-fw fa-cog"></i>
                <span>Đánh giá</span>
            </div>
            <i class="fas fa-chevron-down"></i>
        </a>
        <div id="review" class="collapse" aria-labelledby="review" data-bs-parent="#accordionSidebar">
            <div class="bg-white py-2 collapse-inner rounded">
                <h6 class="collapse-header">Các chức năng</h6>
                <a class="collapse-item" href="buttons.html">Danh sách sản phẩm</a>
                <a class="collapse-item" href="cards.html">Thêm sản phẩm</a>
                <a class="collapse-item" href="cards.html">Danh sách danh mục</a>
                <a class="collapse-item" href="cards.html">Thêm danh mục</a>
            </div>
        </div>
    </li>

    <div class="sidebar-heading">
        Tài khoản
    </div>

    <!-- Nav Item - Order -->
    <li class="nav-item">
        <a class="nav-link collapsed d-flex align-items-center justify-content-between" href="#"
            data-bs-toggle="collapse" data-bs-target="#user" aria-expanded="false" aria-controls="user">
            <div class="flex">
                <i class="fas fa-fw fa-cog"></i>
                <span>Thành viên</span>
            </div>
            <i class="fas fa-chevron-down"></i>
        </a>
        <div id="user" class="collapse" aria-labelledby="user" data-bs-parent="#accordionSidebar">
            <div class="bg-white py-2 collapse-inner rounded">
                <h6 class="collapse-header">Các chức năng</h6>
                <a class="collapse-item" href="buttons.html">Danh sách sản phẩm</a>
                <a class="collapse-item" href="cards.html">Thêm sản phẩm</a>
                <a class="collapse-item" href="cards.html">Danh sách danh mục</a>
                <a class="collapse-item" href="cards.html">Thêm danh mục</a>
            </div>
        </div>
    </li> --}}
    <!-- Divider -->
    <hr class="sidebar-divider d-none d-md-block">

    <!-- Sidebar Toggler (Sidebar) -->
    <div class="text-center d-none d-md-inline">
        <button class="rounded-circle border-0" id="sidebarToggle"></button>
    </div>

</ul>
