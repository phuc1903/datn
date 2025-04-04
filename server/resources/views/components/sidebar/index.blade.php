@php
    // Icon sử dụng icon của bootstrap
    $sidebars = [
        // Dashboard
        [
            'label' => 'Dashboard',
            'active' => request()->routeIs('admin.dashboard'),
            'type' => 'nav',
            'path' => route('admin.dashboard'),
            'icon' => "bi-bar-chart-line",
        ],
        // Quản lý đơn hàng
        [
            'label' => 'Đơn hàng',
            'active' => request()->routeIs('admin.order.index'),
            'type' => 'nav',
            'icon' => 'bi bi-receipt',
            'path' => route('admin.order.index'),
            'permission_required' => 'viewOrder',
        ],
        // Quản lý khách hàng
        [
            'label' => 'Khách hàng',
            'active' => request()->routeIs('admin.user.index'),
            'type' => 'nav',
            'icon' => 'bi-person',
            'path' => route('admin.user.index'),
            'permission_required' => 'viewUser',
        ],
                // Quản lý đánh giá sản phẩm
                [
            'label' => 'Đánh giá sản phẩm',
            'active' => request()->routeIs('admin.feedback-product.index'),
            'type' => 'nav',
            'icon' => 'bi-star',
            'path' => route('admin.feedback-product.index'),
            'permission_required' => 'viewProductFeedback',
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
            'permission_required' => 'viewProduct',
            'child' => [
                [
                    'label' => 'Danh sách sản phẩm',
                    'path' => route('admin.product.index'),
                    'permission_required' => 'viewProduct',
                ],
                [
                    'label' => 'Thêm sản phẩm',
                    'path' => route('admin.product.create'),
                    'permission_required' => 'createProduct',
                ],
                [
                    'label' => 'Danh sách thuộc tính',
                    'path' => route('admin.variant.index'),
                    'permission_required' => 'createProduct',
                ],
                [
                    'label' => 'Thêm thuộc tính',
                    'path' => route('admin.variant.create'),
                    'permission_required' => 'createProduct',
                ],
            ],
        ],
        // Quản lý chương trình combo
        [
            'label' => 'Combo',
            'active' => request()->routeIs('admin.combo.index'),
            'type' => 'nav',
            'icon' => 'bi-box',
            'path' => route('admin.combo.index'),
            'permission_required' => 'viewCombo',
            'child' => [
                [
                    'label' => 'Danh sách combo',
                    'path' => route('admin.combo.index'),
                    'permission_required' => 'viewCombo',
                ],
                [
                    'label' => 'Thêm combo',
                    'path' => route('admin.combo.create'),
                    'permission_required' => 'createCombo',
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
            'permission_required' => 'viewProductCategory',
            'child' => [
                [
                    'label' => 'Danh sách danh mục',
                    'path' => route('admin.category.index'),
                    'permission_required' => 'viewProductCategory',
                ],
                [
                    'label' => 'Thêm danh mục',
                    'path' => route('admin.category.create'),
                    'permission_required' => 'createProductCategory',
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
            'permission_required' => 'viewPost',
            'child' => [
                [
                    'label' => 'Danh bài viết',
                    'path' => route('admin.blog.index'),
                    'permission_required' => 'viewPost',
                ],
                [
                    'label' => 'Thêm bài viết',
                    'path' => route('admin.blog.create'),
                    'permission_required' => 'createPost',
                ],
            ],
        ],
        // Quản lý thẻ
        [
            'label' => 'Thẻ',
            'active' => request()->routeIs('admin.tag.index'),
            'type' => 'nav',
            'icon' => 'bi-bookmark',
            'path' => route('admin.tag.index'),
            'permission_required' => 'viewPost',
            'child' => [
                [
                    'label' => 'Danh sách thẻ',
                    'path' => route('admin.tag.index'),
                    'permission_required' => 'viewPost',
                ],
                [
                    'label' => 'Thêm thẻ',
                    'path' => route('admin.tag.create'),
                    'permission_required' => 'createPost',
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
            'permission_required' => 'viewVoucher',
            'child' => [
                [
                    'label' => 'Danh sách voucher',
                    'path' => route('admin.voucher.index'),
                    'permission_required' => 'viewVoucher',
                ],
                [
                    'label' => 'Thêm voucher',
                    'path' => route('admin.voucher.create'),
                    'permission_required' => 'createVoucher',
                ],
            ],
        ],
        // Title
        [
            'label' => 'Admin',
            'type' => 'header',
            'path' => '',
        ],
        // Quản lý slider
        [
            'label' => 'Slider',
            'active' => request()->routeIs('admin.slider.index'),
            'type' => 'nav',
            'icon' => 'bi-images',
            'path' => route('admin.slider.index'),
            'permission_required' => 'viewSlide',
            'child' => [
                [
                    'label' => 'Danh sách Slider',
                    'path' => route('admin.slider.index'),
                    'permission_required' => 'viewSlide',
                ],
                [
                    'label' => 'Thêm Slide',
                    'path' => route('admin.slider.create'),
                    'permission_required' => 'createSlide',
                ],
            ],
        ],
        // Quản lý thành viên
        [
            'label' => 'Admin',
            'active' => request()->routeIs('admin.admin.index'),
            'type' => 'nav',
            'icon' => 'bi-person-lines-fill',
            'path' => route('admin.admin.index'),
            'permission_required' => 'viewAdmin',
            'child' => [
                [
                    'label' => 'Danh sách Admin',
                    'path' => route('admin.admin.index'),
                    'permission_required' => 'viewAdmin',
                ],
                [
                    'label' => 'Thêm thành viên',
                    'path' => route('admin.admin.create'),
                    'permission_required' => 'createAdmin',
                ],
            ],
        ],
        // Role
        [
            'label' => 'Vai trò',
            'active' => request()->routeIs('admin.role.index'),
            'type' => 'nav',
            'icon' => 'bi-person',
            'path' => route('admin.role.index'),
            'permission_required' => 'viewRole',
            'child' => [
                [
                    'label' => 'Danh sách Vai trò',
                    'path' => route('admin.role.index'),
                    'permission_required' => 'viewRole',
                ],
                [
                    'label' => 'Thêm vai trò',
                    'path' => route('admin.role.create'),
                    'permission_required' => 'createRole',
                ],
            ],
        ],
        // Permission
        [
            'label' => 'Quyền',
            'active' => request()->routeIs('admin.permission.index'),
            'type' => 'nav',
            'icon' => 'bi-person-check',
            'path' => route('admin.permission.index'),
            'permission_required' => 'viewPermission',
            'child' => [
                [
                    'label' => 'Danh sách Quyền',
                    'path' => route('admin.permission.index'),
                    'permission_required' => 'viewPermission',
                ],
                [
                    'label' => 'Thêm Quyền',
                    'path' => route('admin.permission.create'),
                    'permission_required' => 'createPermission',
                ],
            ],
        ],
        [
            'label' => 'Module',
            'active' => request()->routeIs('admin.module.index'),
            'type' => 'nav',
            'icon' => 'bi-code',
            'path' => route('admin.module.index'),
            'permission_required' => 'viewPermission',
            'child' => [
                [
                    'label' => 'Danh sách Module',
                    'path' => route('admin.module.index'),
                    'permission_required' => 'viewPermission',
                ],
                [
                    'label' => 'Thêm Module',
                    'path' => route('admin.module.create'),
                    'permission_required' => 'createPermission',
                ],
            ],
        ],
        // Cài đặt chung
        [
            'label' => 'Cài đặt',
            'active' => request()->routeIs('admin.setting.index'),
            'type' => 'nav',
            'icon' => 'bi-gear',
            'path' => route('admin.setting.index'),
            'permission_required' => 'viewSetting',
            'child' => [
                [
                    'label' => 'Cài đặt chung',
                    'path' => route('admin.setting.index'),
                    'permission_required' => 'viewSetting',
                ],
                // [
                //     'label' => 'Cài đặt Logo',
                //     'path' => route('admin.setting.logo'),
                //     'permission_required' => 'viewSetting',
                // ],
                // [
                //     'label' => 'Cài đặt Footer',
                //     'path' => route('admin.setting.footer'),
                //     'permission_required' => 'viewSetting',
                // ],
                // [
                //     'label' => 'Cài đặt Header',
                //     'path' => route('admin.setting.header'),
                //     'permission_required' => 'viewSetting',
                // ],
                // [
                //     'label' => 'Cài đặt About',
                //     'path' => route('admin.setting.about'),
                //     'permission_required' => 'viewSetting',
                // ],
                // [
                //     'label' => 'Cài đặt Contact',
                //     'path' => route('admin.setting.contact'),
                //     'permission_required' => 'viewSetting',
                // ],
            ],
        ],
    ];
@endphp


<ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion position-fixed top-0 left-0 bottom-0" id="accordionSidebar">

    <!-- Sidebar - Brand -->
    <a class="sidebar-brand d-flex align-items-center justify-content-center" href="index.html" style="height: auto">
        {{-- <div class="sidebar-brand-icon rotate-n-15"> --}}
            <div class="sidebar-brand-icon" style="width: 100%; height: 100px;">
                {{-- <i class="fas fa-laugh-wink"></i> --}}
                <image src="{{ asset('logo/image-removebg-preview.png') }}" class="logo-sideBar"
                    style="object-fit: cover;" />
            </div>
            {{-- <div class="sidebar-brand-text mx-3">SB Admin <sup>2</sup></div> --}}
    </a>

    <!-- Divider -->
    <hr class="sidebar-divider my-0">

    <!-- Divider -->
    <hr class="sidebar-divider">

    <div class="accordion" id="sidebar">
        @foreach ($sidebars as $index => $item)
            @if(!isset($item['permission_required']) || auth()->user()->can($item['permission_required']))
                <x-sidebar.side-bar-item id="{{ $index }}" :sidebar="$item" />
            @endif
        @endforeach
    </div>


    <!-- Divider -->
    <hr class="sidebar-divider d-none d-md-block">

    <!-- Sidebar Toggler (Sidebar) -->
    <div class="text-center d-none d-md-inline">
        <button class="rounded-circle border-0" id="sidebarToggle"></button>
    </div>

</ul>