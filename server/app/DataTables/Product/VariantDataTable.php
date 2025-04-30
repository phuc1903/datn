<?php

namespace App\DataTables\Product;

use App\DataTables\BaseDataTable;
use App\Models\Variant;
use Illuminate\Database\Eloquent\Builder as QueryBuilder;
use Yajra\DataTables\Html\Column;
use Yajra\DataTables\EloquentDataTable;

class VariantDataTable extends BaseDataTable
{
    protected bool $includeCreatedAt = true;
    protected bool $includeUpdatedAt = true;
    protected bool $includeAction = true;
    protected int $orderBy = 1;
    protected string $routeName = 'variant';
    protected string $tableId = 'variant-table';


    public function query(): QueryBuilder
    {
        return Variant::query()
            ->with('values')
            ->select('variants.id', 'variants.name', 'variants.created_at', 'variants.updated_at');
    }


    /**
     * Thêm các cột đặc trưng của bảng User.
     */
    protected function extraColumns(): array
    {
        return [
            Column::make('name')->title('Tên thuộc tính')->width(200),
            Column::computed('values')->title('Các biến thể')
        ];
    }

    protected function getEditableColumns(): array
    {
        return ['values'];
    }

    protected function customizeDataTable(EloquentDataTable $dataTable): EloquentDataTable
    {
        return $dataTable->editColumn('values', function ($variant) {
            return $variant->values->pluck('value')->implode(', ');
        });
    }
}
