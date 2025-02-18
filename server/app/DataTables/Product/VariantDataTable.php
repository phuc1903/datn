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

    /**
     * Get the query source of dataTable.
     */
    // public function query(): QueryBuilder
    // {
    //     return Variant::query()
    //     ->leftJoin('variant_value', 'variants.id', '=', 'variant_value.variant_id')
    //     ->select('variants.name', 'variants.created_at', 'variants.updated_at', 'variant_value.value')
    //     ->groupBy('variant.name', 'variant.created_at', 'variant.updated_at', 'variant_value.value')
    //     ;
    // }
    public function query(): QueryBuilder
    {
        return Variant::query()
            ->with('values') // Eager Load các giá trị liên quan
            ->select('variants.id', 'variants.name', 'variants.created_at', 'variants.updated_at');
    }


    /**
     * Thêm các cột đặc trưng của bảng User.
     */
    protected function extraColumns(): array
    {
        return [
            // Column::make('avatar')->title('Ảnh đại diện')->orderable(false)->searchable(false),
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
