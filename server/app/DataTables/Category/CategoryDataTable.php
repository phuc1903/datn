<?php

namespace App\DataTables\Category;

use App\DataTables\BaseDataTable;
use App\Enums\Category\CategoryStatus;
use App\Models\Category;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder as QueryBuilder;
use Yajra\DataTables\EloquentDataTable;
use Yajra\DataTables\Html\Builder as HtmlBuilder;
use Yajra\DataTables\Html\Button;
use Yajra\DataTables\Html\Column;
use Yajra\DataTables\Html\Editor\Editor;
use Yajra\DataTables\Html\Editor\Fields;

class CategoryDataTable extends BaseDataTable
{
    protected string $tableId = "category-table";
    protected string $routeName = "category";
    protected bool $includeCreatedAt = true;
    protected bool $includeUpdatedAt = true;

    protected int $orderBy = 5;

    /**
     * Get the query source of dataTable.
     */
    public function query(): QueryBuilder
    {
        return Category::query();
    }

    public function extraColumns(): array
    {
        return [
            Column::make('image')->title('Ảnh')->orderable(false)->searchable(false),
            Column::make('name')->title('Tên danh mục'),
            Column::make('status')->title('Trạng thái'),
        ];
    }

    protected function getEditableColumns(): array
    {
        return ['status', 'image'];
    }

    protected function customizeDataTable(EloquentDataTable $dataTable): EloquentDataTable
    {
        return $dataTable
            ->editColumn('status', function ($category) {
                $statusEnum = CategoryStatus::fromValue($category->status);
                return $statusEnum->badge();
            })
            ->editColumn('image', function ($category) {
                $imageUrl = optional($category->first())->image ?? asset('default-image.jpg');
                return '<img class="rounded mx-auto d-block image-cover image-table" src="' . asset($imageUrl) . '"/>';
            });
    }
}
