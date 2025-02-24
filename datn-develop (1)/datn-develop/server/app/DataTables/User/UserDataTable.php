<?php

namespace App\DataTables\User;

use App\DataTables\BaseDataTable;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder as QueryBuilder;
use Yajra\DataTables\Html\Column;

class UserDataTable extends BaseDataTable
{
    protected string $routeName = 'user';
    protected bool $hasActions = true;
    protected bool $hasStatus = true;

    protected function extraColumns(): array
    {
        return [
            Column::make('first_name')->title('Tên đầu'),
            Column::make('email')->title('Email'),
            Column::make('phone_number')->title('Số điện thoại'),
        ];
    }

    public function query(User $model): QueryBuilder
    {
        return $model->newQuery()->select(['id', 'first_name', 'email', 'phone_number', 'status']);
    }
}
