<?php

namespace App\DataTables\Admin;

use App\DataTables\BaseDataTable;
use App\Enums\Admin\AdminStatus;
use App\Models\Admin;
use Illuminate\Database\Eloquent\Builder as QueryBuilder;
use Yajra\DataTables\EloquentDataTable;
use Yajra\DataTables\Html\Column;

class AdminDataTable extends BaseDataTable
{
    protected string $routeName = 'admin';
    protected string $tableId = 'admin-table';

    /**
     * Get the query source of dataTable.
     */
    public function query(): QueryBuilder
    {
        return Admin::query();
    }

    /**
     * Thêm các cột đặc trưng của bảng User.
     */
    protected function extraColumns(): array
    {
        return [
            Column::make('first_name')->title('Họ và Tên'),
            Column::make('email')->title('Email'),
            Column::make('phone_number')->title('Số điện thoại'),
            Column::make('status')->title('Trạng thái')->addClass("no-search"),
        ];
    }

    protected function getEditableColumns(): array
    {
        return ['status'];
    }

    protected function customizeDataTable(EloquentDataTable $dataTable): EloquentDataTable
    {
        $dataTable
            ->editColumn('status', function ($user) {
                return AdminStatus::fromValue($user->status)->badge();
            });

        return $dataTable;
    }
}
