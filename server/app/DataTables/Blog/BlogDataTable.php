<?php

namespace App\DataTables\Blog;

use App\DataTables\BaseDataTable;
use App\Enums\Blog\BlogStatus;
use App\Models\Blog;
use Illuminate\Database\Eloquent\Builder as QueryBuilder;
use Yajra\DataTables\EloquentDataTable;
use Yajra\DataTables\Html\Column;
use Illuminate\Support\Str;

class BlogDataTable extends BaseDataTable
{
    protected string $tableId = "blog-table";
    protected string $routeName = "blog";
    protected bool $includeCreatedAt = true;
    protected bool $includeUpdatedAt = true;

    protected int $orderBy = 5;

    /**
     * Get the query source of dataTable.
     */
    public function query(): QueryBuilder
    {
        return Blog::query();
    }

    public function extraColumns(): array
    {
        return [
            Column::make('image_url')->title('Ảnh')->orderable(false)->searchable(false)->addClass("no-search"),
            Column::make('title')->title('Tiêu đề'),
            Column::make('short_description')->title('Mô tả ngắn'),
            Column::make('status')->title('Trạng thái')->addClass("no-search"),
        ];
    }

    protected function getEditableColumns(): array
    {
        return ['status', 'image_url', 'short_description'];
    }

    protected function customizeDataTable(EloquentDataTable $dataTable): EloquentDataTable
    {
        return $dataTable
            ->editColumn('status', function ($blog) {
                $statusEnum = BlogStatus::fromValue($blog->status);
                return $statusEnum->badge();
            })
            ->editColumn('image_url', function ($blog) {
                return '<img class="rounded mx-auto d-block image-cover image-table blog small" src="' . asset($blog->image_url) . '"/>';
            })
            ->editColumn('short_description', function ($blog) {
                return Str::limit($blog->short_description, 30, '...');
            });
    }
}
