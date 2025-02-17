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
    protected bool $includeCreatedAt = true;
    protected bool $includeUpdatedAt = true;
    protected bool $includeAction = true;

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
            // Column::make('avatar')->title('Ảnh đại diện')->orderable(false)->searchable(false),
            Column::make('first_name')->title('Họ và Tên'),
            Column::make('email')->title('Email'),
            Column::make('phone_number')->title('Số điện thoại'),
            Column::make('status')->title('Trạng thái'),
        ];
    }

    protected function getEditableColumns(): array
    {
        return ['status']; 
    }

    protected function customizeDataTable(EloquentDataTable $dataTable): EloquentDataTable
    {
        return $dataTable->editColumn('status', function ($user) {
            return UserStatus::fromValue($user->status)->badge();
        });
    }


}
