<?php

namespace App\DataTables\Voucher;

use App\DataTables\BaseDataTable;
use App\Enums\Voucher\VoucherStatus;
use App\Enums\Voucher\VoucherType;
use App\Models\Voucher;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Builder as QueryBuilder;
use Yajra\DataTables\EloquentDataTable;
use Yajra\DataTables\Html\Column;
use Carbon\Carbon;

class VoucherDataTable extends BaseDataTable
{
    protected string $tableId = "voucher-table";
    protected string $routeName = "voucher";
    protected bool $includeUpdatedAt = false;

    protected int $orderBy = 7;

    /**
     * Get the query source of dataTable.
     */
    public function query(): QueryBuilder
    {
        return Voucher::query();
    }

    public function extraColumns(): array
    {
        return [
            Column::make('title')->title('Tên voucher'),
            Column::make('quantity')->title('Số lượng'),
            Column::make('discount_value')->title('Giảm giá'),
            Column::make('type')->title('Loại')->addClass('no-search'),
            Column::make('status')->title('Trạng thái')->addClass("no-search"),
            Column::make('started_date')->title('Ngày bắt đầu')->addClass('no-search'),
            Column::make('ended_date')->title('Ngày kết thúc')->addClass('no-search'),
        ];
    }

    protected function getEditableColumns(): array
    {
        return ['status', 'type', 'description'];
    }

    protected function customizeDataTable(EloquentDataTable $dataTable): EloquentDataTable
    {
        return $dataTable
            ->editColumn('status', function ($category) {
                $statusEnum = VoucherStatus::fromValue($category->status);
                return $statusEnum->badge();
            })
            ->editColumn('started_date', function($voucher) {
                return Carbon::parse($voucher->date_start)->format('d-m-Y');
            })
            ->editColumn('ended_date', function($voucher) {
                return Carbon::parse($voucher->date_start)->format('d-m-Y');
            })
            ->editColumn('discount_value', function($voucher) {
                return number_format($voucher->discount_value, 0, '.', '.');
            })
            ->editColumn('type', function ($voucher) {
                $typeEnum = VoucherType::fromValue($voucher->type);
                return $typeEnum->badge();
            });
    }
}
