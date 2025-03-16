<?php

namespace App\DataTables\Slider;

use App\DataTables\BaseDataTable;
use App\Enums\Slide\SlideStatus;
use App\Models\Slider;
use Illuminate\Database\Eloquent\Builder as QueryBuilder;
use Yajra\DataTables\EloquentDataTable;
use Yajra\DataTables\Html\Builder as HtmlBuilder;
use Yajra\DataTables\Html\Button;
use Yajra\DataTables\Html\Column;
use Yajra\DataTables\Html\Editor\Editor;
use Yajra\DataTables\Html\Editor\Fields;

class SliderDataTable extends BaseDataTable
{
    protected string $tableId = "slider-table";
    protected string $routeName = "slider";
    protected bool $includeCreatedAt = true;
    protected bool $includeUpdatedAt = true;

    protected int $orderBy = 5;

    /**
     * Get the query source of dataTable.
     */
    public function query(): QueryBuilder
    {
        return Slider::query();
    }

    public function extraColumns(): array
    {
        return [
            Column::make('image_url')->title('Ảnh')->orderable(false)->searchable(false)->addClass("no-search"),
            Column::make('name')->title('Tên danh mục'),
            Column::make('priority')->title('Ưu tiên'),
            Column::make('status')->title('Trạng thái')->addClass("no-search"),
        ];
    }

    protected function getEditableColumns(): array
    {
        return ['status', 'image_url'];
    }

    protected function customizeDataTable(EloquentDataTable $dataTable): EloquentDataTable
    {
        return $dataTable
            ->editColumn('status', function ($slider) {
                $statusEnum = SlideStatus::fromValue($slider->status);
                return $statusEnum->badge();
            })
            ->editColumn('image_url', function ($slider) {
                return '<img class="rounded mx-auto d-block image-cover image-table slider small" src="' . asset($slider->image_url) . '"/>';
            });
    }
}
