<?php

namespace App\DataTables\Product;

use App\DataTables\BaseDataTable;
use App\Enums\Product\ProductStatus;
use App\Models\Product;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Builder as QueryBuilder;
use Yajra\DataTables\EloquentDataTable;
use Yajra\DataTables\Html\Column;

class ProductDataTable extends BaseDataTable
{
    protected bool $includeUpdatedAt = false;
    protected string $routeName = 'product';
    protected string $tableId = 'product-table';
    protected int $orderBy = 6;

    /**
     * Get the query source of dataTable.
     */
    public function query(): QueryBuilder
    {
        return Product::query()
            ->with(['skus' => function ($query) {
                $query->orderBy('id')->limit(1);
            }])
            ->select('products.*')
            ->selectRaw('(SELECT skus.price FROM skus WHERE skus.product_id = products.id ORDER BY skus.id LIMIT 1) as skus_price')
            ->selectRaw('(SELECT skus.image_url FROM skus WHERE skus.product_id = products.id ORDER BY skus.id LIMIT 1) as skus_image_url');
    }

    /**
     * Define extra columns.
     */
    public function extraColumns(): array
    {
        return [
            Column::make('image')->title('Ảnh')->orderable(false)->searchable(false)->addClass("no-search"),
            Column::make('name')->title("Tên sản phẩm"),
            Column::make('short_description')->title("Mô tả ngắn"),
            Column::make('status')->title("Trạng thái")->addClass("no-search"),
            Column::make('skus_price')->title("Giá")->width(200)->type("num"),
        ];
    }

    /**
     * Define editable columns.
     */
    protected function getEditableColumns(): array
    {
        return ['status', 'image', 'full_name', 'skus_price', 'short_description'];
    }

    /**
     * Customize DataTable processing.
     */
    protected function customizeDataTable(EloquentDataTable $dataTable): EloquentDataTable
    {
        return $dataTable
            ->editColumn('status', function ($model) {
                $statusEnum = ProductStatus::fromValue($model->status);
                return $statusEnum->badge();
            })
            ->editColumn('image', function ($product) {
                $imageUrl = $product->skus_image_url ?? asset('default-image.jpg');
                return '<img class="rounded mx-auto d-block image-cover image-table" src="' . asset($imageUrl) . '"/>';
            })
            ->editColumn('skus_price', function ($product) {
                $price = $product->skus_price ?? 0;
                return number_format($price, 0, ',', '.') . ' VNĐ';
            })
            ->editColumn('short_description', function ($product) {
                return Str::limit($product->short_description, 50, '...');
            })
            ->filterColumn('skus_price', callback: function ($query, $keyword) {
                $query->whereRaw("(SELECT skus.price FROM skus WHERE skus.product_id = products.id ORDER BY skus.id LIMIT 1) LIKE ?", ["%{$keyword}%"]);
            })
            ->orderColumn('skus_price', function ($query, $direction) {
                $query->orderByRaw("(SELECT skus.price FROM skus WHERE skus.product_id = products.id ORDER BY skus.id LIMIT 1) {$direction}");
            })
            ->setRowId('id')
            ->rawColumns(['status', 'action', 'image', 'skus_price']);
    }
}
