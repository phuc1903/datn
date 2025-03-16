<?php

namespace App\DataTables\Role;

use App\DataTables\BaseDataTable;
use App\Models\Role;
use Illuminate\Database\Eloquent\Builder as QueryBuilder;
use Yajra\DataTables\Html\Column;

class RoleDataTable extends BaseDataTable
{
    protected string $tableId = "role-table";
    protected string $routeName = "role";
    protected bool $includeCreatedAt = true;
    protected bool $includeUpdatedAt = true;

    protected int $orderBy = 2;

    /**
     * Get the query source of dataTable.
     */
    public function query(): QueryBuilder
    {
        return Role::query();
    }

    public function extraColumns(): array
    {
        return [
            Column::make('title')->title('Tên vai trò'),
            Column::make('name')->title('Slug'),
            Column::make('guard_name')->title('Nhóm quyền ( Guard Name )'),
        ];
    }
}
