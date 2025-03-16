<?php

namespace App\DataTables\Module;

use App\DataTables\BaseDataTable;
use App\Enums\Module\ModuleStatus;
use App\Models\Module;
use Illuminate\Database\Eloquent\Builder as QueryBuilder;
use Yajra\DataTables\EloquentDataTable;
use Yajra\DataTables\Html\Column;

class ModuleDataTable extends BaseDataTable
{
    protected string $tableId = "module-table";
    protected string $routeName = "module";
    protected int $orderBy = 3;

    /**
     * Get the query source of dataTable.
     */
    public function query(): QueryBuilder
    {
        return Module::query();
    }

    public function extraColumns(): array
    {
        return [
            Column::make('name')->title('Tên Module'),
            Column::make('status')->title('Trạng thái')->addClass('no-search'),
        ];
    }

    protected function getEditableColumns(): array
    {
        return ['status'];
    }

    protected function customizeDataTable(EloquentDataTable $dataTable): EloquentDataTable
    {
        $dataTable
            ->editColumn('status', function($module) {
                return ModuleStatus::fromValue($module->status)->badge();
            });
        
        return $dataTable;
    }
}
