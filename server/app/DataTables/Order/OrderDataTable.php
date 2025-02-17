<?php

namespace App\DataTables\Order;

use App\DataTables\BaseDataTable;
use App\Enums\Order\OrderPaymentMethod;
use App\Enums\Order\OrderStatus;
use App\Models\Order;
use Illuminate\Database\Eloquent\Builder as QueryBuilder;
use Yajra\DataTables\EloquentDataTable;
use Yajra\DataTables\Html\Builder as HtmlBuilder;
use Yajra\DataTables\Html\Button;
use Yajra\DataTables\Html\Column;
use Yajra\DataTables\Html\Editor\Editor;
use Yajra\DataTables\Html\Editor\Fields;

class OrderDataTable extends BaseDataTable
{
    protected bool $includeCreatedAt = true;
    // protected bool $includeUpdatedAt = true;
    protected bool $includeAction = true;

    protected string $routeName = 'order';
    protected string $tableId = 'order-table';
    /**
     * Get the query source of dataTable.
     */
    public function query(): QueryBuilder
    {
        return Order::query();
    }

    protected function extraColumns(): array
    {
        return [
            // Column::make('avatar')->title('Ảnh đại diện')->orderable(false)->searchable(false),
            Column::make('full_name')->title('Khách hàng'),
            Column::make('phone_number')->title('SĐT Khách hàng'),
            Column::make('payment_method')->title('PT Thanh toán'),
            Column::make('total_amount')->title('Tổng tiền'),
            Column::make('status')->title('Trạng thái'),
        ];
    }

    protected function getEditableColumns(): array
    {
        return ['status', 'payment_method', 'full_name', 'total_amount'];
    }

    protected function customizeDataTable(EloquentDataTable $dataTable): EloquentDataTable
    {
        $dataTable
        ->editColumn('payment_method', function ($order) {
            return OrderPaymentMethod::fromValue($order->payment_method)->badge();
        })
        ->editColumn('full_name', function ($order) {
            return '<a href="' . route('admin.user.edit', $order->user_id) . '">' . e($order->full_name) . '</a>';
        })
        ->editColumn('total_amount', function ($order) {
            $price = $order->total_amount ?? 0;
            $formattedPrice = number_format($price, 0, '.', '.');
            return '<div class="price" data-sort="' . $price . '">' . $formattedPrice . ' VNĐ</div>';
        })
        ->editColumn('status', function ($order) {
            return OrderStatus::fromValue($order->status)->badge();
        });

        return $dataTable;
    }

}
