<?php

namespace App\DataTables\Order;

use App\DataTables\BaseDataTable;
use App\Enums\Order\OrderPaymentMethod;
use App\Enums\Order\OrderStatus;
use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder as QueryBuilder;
use Yajra\DataTables\EloquentDataTable;
use Yajra\DataTables\Html\Column;

class OrderDataTable extends BaseDataTable
{
    protected bool $includeUpdatedAt = false;
    protected bool $includeCreatedAt = false;
    protected bool $includeAction = false;

    protected string $routeName = 'order';
    protected string $tableId = 'order-table';
    protected int $orderBy = 7;
    /**
     * Get the query source of dataTable.
     */
    public function query(): QueryBuilder
    {
        $provinces = request('provinces') ?? null;
        $districts = request('districts') ?? null;
        $wards = request('wards') ?? null;
        $query = Order::query()->with('province');
        if ($provinces && $districts && $wards) {
            $query->where('province_code', $provinces)->where('district_code', $districts)->where('ward_code', $wards);
        }
        return $query;
    }

    protected function extraColumns(): array
    {
        return [
            // Column::make('avatar')->title('Ảnh đại diện')->orderable(false)->searchable(false),
            Column::make('full_name')->title('Khách hàng'),
            Column::make('address')->title('Địa chỉ giao hàng')->orderable(true),
            Column::make('phone_number')->title('SĐT KH'),
            Column::make('payment_method')->title('PT Thanh toán')->addClass("no-search"),
            Column::make('total_amount')->title('Tổng tiền'),
            Column::make('status')->title('Trạng thái')->addClass("no-search"),
            Column::make('created_at')->title('Ngày đặt')->width(130),
            Column::make('detail')->title('Chi tiết')->searchable(false)->orderable(false)->width(80)->addClass("no-search"),
            
        ];
    }

    protected function getEditableColumns(): array
    {
        return ['status', 'payment_method', 'full_name', 'total_amount', 'address', 'detail'];
    }

    protected function customizeDataTable(EloquentDataTable $dataTable): EloquentDataTable
    {
        $dataTable
        ->addColumn('detail', function($order) {
            $editUrl = route('admin.order.edit', $order);
            return '<div class="d-flex gap-2">
        <a class="btn btn-warning text-white" href="' . $editUrl . '"><i class="bi bi-eye"></i></a>';
        })
        ->editColumn('payment_method', function ($order) {
            return OrderPaymentMethod::fromValue($order->payment_method)->badge();
        })
        ->editColumn('full_name', function ($order) {
            return '<a href="' . route('admin.user.edit', $order->user_id) . '">' . e($order->full_name) . '</a>';
        })
        ->editColumn('address', function($order) {
            return '<div data-sort="' . $order->province->name . '">' . $order->address . '</div>';
        })
        ->editColumn('total_amount', function ($order) {
            $price = $order->total_amount ?? 0;
            $formattedPrice = number_format($price, 0, '.', '.');
            return '<div class="price" data-sort="' . $price . '">' . $formattedPrice . ' VNĐ</div>';
        })
        ->editColumn('created_at', function($order) {
            return Carbon::parse($order->created_at)->format('d-m-Y');
        })
        ->editColumn('status', function ($order) {
            return OrderStatus::fromValue($order->status)->badge();
        });

        return $dataTable;
    }

}
