<?php

namespace App\DataTables\Product;

use App\DataTables\BaseDataTable;
use App\Enums\Product\ProductFeedbackStatus;
use App\Models\ProductFeedback;
use Illuminate\Database\Eloquent\Builder as QueryBuilder;
use Yajra\DataTables\EloquentDataTable;
use Yajra\DataTables\Html\Column;
use Carbon\Carbon;

class FeedbackDataTable extends BaseDataTable
{
    protected bool $includeAction = false;
    protected bool $includeUpdatedAt = false;
    protected bool $includeCreatedAt = false;
    protected string $tableId = "feedback-product-table";
    protected string $routeName = "feedback-product";

    protected int $orderBy = 4;

    /**
     * Get the query source of dataTable.
     */
    public function query(): QueryBuilder
    {
        $query = ProductFeedback::query()->with('user', 'order', 'sku.product');
        return $query;
    }

    public function extraColumns(): array
    {
        return [
            Column::make('name')->title('Người đánh giá'),
            Column::make('sku')->title('Tên sản phẩm'),
            Column::make('order')->title('Đơn hàng'),
            Column::make('comment')->title('Nội dung'),
            Column::make('status')->title('Trạng thái')->addClass("no-search"),
            Column::make('created_at')->title('Ngày đánh giá')->width(150)->addClass('no-search'),
            Column::make('detail')->title('Chi tiết')->searchable(false)->orderable(false)->width(80)->addClass("no-search"),
        ];
    }

    protected function getEditableColumns(): array
    {
        return ['status', 'name', 'sku', 'order', 'detail'];
    }

    protected function customizeDataTable(EloquentDataTable $dataTable): EloquentDataTable
    {
        return $dataTable
            ->editColumn('created_at', function($feedback) {
                return Carbon::parse($feedback->created_at)->format('d-m-Y');
            })
            ->addColumn('detail', function ($feedback) {
                $editUrl = route('admin.feedback-product.edit', $feedback);
                return '<div class="d-flex gap-2">
                <a class="btn btn-warning text-white" href="' . $editUrl . '"><i class="bi bi-eye"></i></a>';
            })
            ->editColumn('name', function ($feedback) {
                return '<a href="' . route('admin.user.edit', $feedback->user->id) . '">' . e($feedback->user->first_name) . '</a>';
            })
            ->editColumn('sku', function ($feedback) {
                return '<a href="' . route('admin.product.edit', $feedback->sku->product->id) . '">' . e($feedback->sku->product->name) . '</a>';
            })
            ->editColumn('order', function ($feedback) {
                return '<a href="' . route('admin.order.edit', $feedback->order->id) . '">' . e($feedback->order->full_name) . '</a>';
            })
            ->editColumn('status', function ($feedback) {
                $statusEnum = ProductFeedbackStatus::fromValue($feedback->status);
                return $statusEnum->badge();
            });
    }
}
