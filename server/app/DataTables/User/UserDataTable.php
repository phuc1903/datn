<?php

namespace App\DataTables\User;

use App\DataTables\BaseDataTable;
use App\Enums\User\UserStatus;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder as QueryBuilder;
use Yajra\DataTables\Html\Column;
use Yajra\DataTables\EloquentDataTable;

class UserDataTable extends BaseDataTable
{
    protected bool $includeCreatedAt = false;
    protected bool $includeAction = false;

    protected string $routeName = 'user';
    protected string $tableId = 'user-table';

    /**
     * Get the query source of dataTable.
     */
    public function query(): QueryBuilder
    {
        return User::query();
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
            Column::make('detail')->title('hành động')->searchable(false)->orderable(false)->width(80)->addClass("no-search"),
        ];
    }

    protected function getEditableColumns(): array
    {
        return ['status', 'detail'];
    }

    protected function customizeDataTable(EloquentDataTable $dataTable): EloquentDataTable
    {
        $dataTable
            ->addColumn('detail', function ($user) {
                $editUrl = route('admin.user.edit', $user);
                return '<div class="d-flex gap-2">
        <a class="btn btn-warning text-white" href="' . $editUrl . '"><i class="bi bi-eye"></i></a>';
            })
            ->editColumn('status', function ($user) {
                return UserStatus::fromValue($user->status)->badge();
            });

        return $dataTable;
    }
}
