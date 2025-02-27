<?php

namespace App\DataTables\Blog;

use App\DataTables\BaseDataTable;
use App\Models\Tag;
use Illuminate\Database\Eloquent\Builder as QueryBuilder;
use Yajra\DataTables\EloquentDataTable;
use Yajra\DataTables\Html\Column;
use Yajra\DataTables\Html\Editor\Editor;
use Yajra\DataTables\Html\Editor\Fields;

class TagDataTable extends BaseDataTable
{
    protected string $tableId = "tag-table";
    protected string $routeName = "tag";
    protected bool $includeCreatedAt = true;
    protected bool $includeUpdatedAt = true;

    protected int $orderBy = 3;

    protected bool $deleteItem = true;

    /**
     * Get the query source of dataTable.
     */
    public function query(): QueryBuilder
    {
        return Tag::query();
    }

    public function extraColumns(): array
    {
        return [
            Column::make('name')->title('Tên danh mục')->orderable(false)->searchable(false),
        ];
    }
}
