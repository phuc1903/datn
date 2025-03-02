<?php

namespace App\DataTables\Permission;

use App\DataTables\BaseDataTable;
use App\Models\Permission;
use Illuminate\Database\Eloquent\Builder as QueryBuilder;
use Yajra\DataTables\EloquentDataTable;
use Yajra\DataTables\Html\Column;
use Illuminate\Support\Str;

class PermissionDataTable extends BaseDataTable
{
    protected string $tableId = "permission-table";
    protected string $routeName = "permission";
    protected bool $includeCreatedAt = true;
    protected bool $includeUpdatedAt = true;

    protected int $orderBy = 5;

    /**
     * Get the query source of dataTable.
     */
    public function query(): QueryBuilder
    {
        return Permission::query();
    }

    public function extraColumns(): array
    {
        return [
            Column::make('title')->title('Tên quền'),
            Column::make('name')->title('slug'),
            Column::make('guard_name')->title('Nhóm quyền ( Guard Name )'),
            // Column::make('status')->title('Trạng thái'),
        ];
    }
}
