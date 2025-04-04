<?php

use App\Models\Admin;
use App\Models\Blog;
use App\Models\Category;
use App\Models\Combo;
use App\Models\Module;
use App\Models\Order;
use App\Models\Permission;
use App\Models\ProductFeedback;
use App\Models\Role;
use App\Models\Setting;
use App\Models\Slider;
use App\Models\Tag;
use App\Models\User;
use App\Models\Variant;
use App\Models\Voucher;
use Diglactic\Breadcrumbs\Breadcrumbs;
use Diglactic\Breadcrumbs\Generator as BreadcrumbTrail;

// Home
Breadcrumbs::for('admin.dashboard', function (BreadcrumbTrail $trail) {
    $trail->push('Thống kê', route('admin.dashboard'));
});

Breadcrumbs::macro('resource', function (string $name, string $title, $model) {
    Breadcrumbs::for("admin.{$name}.index", function (BreadcrumbTrail $trail) use ($name, $title) {
        $trail->parent('admin.dashboard');
        $trail->push($title, route("admin.{$name}.index"));
    });
    Breadcrumbs::for("admin.{$name}.create", function (BreadcrumbTrail $trail) use ($name, $title) {
        $trail->parent("admin.{$name}.index");
        $trail->push('Tạo '. $title, route("admin.{$name}.create"));
    });
    Breadcrumbs::for("admin.{$name}.edit", function (BreadcrumbTrail $trail) use ($name, $title, $model) {
        $trail->parent("admin.{$name}.index", $model);
        $trail->push('Cập nhật '. $title, route("admin.{$name}.edit", $model));
    });
});

Breadcrumbs::resource('blog', 'Bài viết', Blog::class);
Breadcrumbs::resource('user', 'Khách hàng', User::class);
Breadcrumbs::resource('product', 'Sản phẩm', Product::class);
Breadcrumbs::resource('variant', 'Thuộc tính', Variant::class);
Breadcrumbs::resource('feedback-product', 'Đánh giá sản phẩm', ProductFeedback::class);
Breadcrumbs::resource('category', 'Danh mục sản phẩm', Category::class);
Breadcrumbs::resource('tag', 'Thẻ sản phẩm', Tag::class);
Breadcrumbs::resource('admin', 'Thành viên', Admin::class);
Breadcrumbs::resource('combo', 'Combo', Combo::class);
Breadcrumbs::resource('module', 'Nhóm quyền', Module::class);
Breadcrumbs::resource('order', 'Đơn hàng', Order::class);
Breadcrumbs::resource('permission', 'Quyền', Permission::class);
Breadcrumbs::resource('role', 'Vai trò', Role::class);
Breadcrumbs::resource('setting', 'Cài đặt', Setting::class);
Breadcrumbs::resource('slider', 'Slider', Slider::class);
Breadcrumbs::resource('voucher', 'Voucher', Voucher::class);