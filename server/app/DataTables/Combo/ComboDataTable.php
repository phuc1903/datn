<?php

namespace App\DataTables\Combo;

use App\DataTables\BaseDataTable;
use App\Enums\Combo\ComboHot;
use App\Enums\Combo\ComboStatus;
use App\Models\Combo;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder as QueryBuilder;
use Yajra\DataTables\EloquentDataTable;
use Yajra\DataTables\Html\Column;

class ComboDataTable extends BaseDataTable
{
    protected bool $includeCreatedAt = false;
    protected bool $includeUpdatedAt = false;
    protected string $tableId = "combo-table";
    protected string $routeName = "combo";

    protected int $orderBy = 4;

    /**
     * Get the query source of dataTable.
     */
    public function query(): QueryBuilder
    {
        return Combo::query();
    }

    public function extraColumns(): array
    {
        return [
            Column::make('image_url')->title('Ảnh')->orderable(false)->searchable(false)->addClass("no-search"),
            Column::make('name')->title('Tên combo'),
            Column::make('quantity')->title('Số lượng'),
            Column::make('price')->title('Giá'),
            Column::make('promotion_price')->title('Giá khuyến mãi'),
            Column::make('date_start')->title('Ngày bắt đầu'),
            Column::make('date_end')->title('Ngày kết thúc'),
            Column::make('is_hot')->title('Hot'),
            Column::make('status')->title('Trạng thái')->addClass("no-search"),
        ];
    }

    protected function getEditableColumns(): array
    {
        return ['status', 'image_url', 'is_hot', 'price', 'promotion_price'];
    }

    protected function customizeDataTable(EloquentDataTable $dataTable): EloquentDataTable
    {
        return $dataTable
            ->editColumn('status', function ($combo) {
                $statusEnum = ComboStatus::fromValue($combo->status);
                return $statusEnum->badge();
            })
            ->editColumn('is_hot', function ($combo) {
                $isHot = ComboHot::fromValue($combo->is_hot);
                return $isHot->badge();
            })
            ->editColumn('image_url', function ($combo) {
                return '<img class="rounded mx-auto d-block image-cover image-table category small" src="' . asset($combo->image_url) . '"/>';
            })
            ->editColumn('price', function ($combo) {
                $price = $combo->price ?? 0;
                return number_format($price, 0, ',', '.') . ' VNĐ';
            })
            ->editColumn('date_start', function ($combo) {
                return Carbon::parse($combo->date_start)->format('Y-m-d');
            })
            ->editColumn('date_end', function ($combo) {
                return Carbon::parse($combo->date_end)->format('Y-m-d');
            })
            ->editColumn('promotion_price', function ($combo) {
                $price = $combo->promotion_price ?? 0;
                return number_format($price, 0, ',', '.') . ' VNĐ';
            });
    }
}
