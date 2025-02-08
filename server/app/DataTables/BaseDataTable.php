<?php

namespace App\DataTables;

use Illuminate\Database\Eloquent\Builder as QueryBuilder;
use Yajra\DataTables\EloquentDataTable;
use Yajra\DataTables\Html\Builder as HtmlBuilder;
use Yajra\DataTables\Html\Button;
use Yajra\DataTables\Html\Column;
use Yajra\DataTables\Services\DataTable;

class BaseDataTable extends DataTable
{
    protected string $routeName = ''; // ✅ Fix lỗi `Undefined property`
    protected bool $hasActions = true;
    protected bool $hasStatus = true;

    protected function extraColumns(): array
    {
        return [];
    }

    public function dataTable(QueryBuilder $query): EloquentDataTable
    {
        $dataTable = (new EloquentDataTable($query))
            ->addIndexColumn()
            ->setRowId('id');

        if ($this->hasActions) {
            $dataTable->addColumn('action', fn($item) => $this->actionButtons($item));
        }

        if ($this->hasStatus) {
            $dataTable->editColumn('status', fn($item) => $this->formatStatus($item));
        }

        return $dataTable->rawColumns(array_merge(['status', 'action'], method_exists($this, 'extraColumns') ? $this->extraColumns() : []));
    }

    protected function actionButtons($item): string
    {
        $editUrl = route("admin.{$this->routeName}.edit", $item->id);
        $deleteUrl = route("admin.{$this->routeName}.destroy", $item->id);
        return '
            <div class="d-flex gap-2">
                <a class="btn btn-warning text-white" href="' . $editUrl . '">Sửa</a>
                <form action="' . $deleteUrl . '" method="POST" class="btn btn-danger ml-2">
                    ' . csrf_field() . method_field('DELETE') . '
                    <button type="submit" class="bg-transparent border-0 text-white">Xóa</button>
                </form>
            </div>
        ';
    }

    protected function formatStatus($item): string
    {
        return method_exists($item, 'getStatusBadge') ? $item->getStatusBadge() : $item->status;
    }

    public function html(): HtmlBuilder
    {
        return $this->builder()
            ->setTableId("{$this->routeName}-table")
            ->columns($this->getColumns())
            ->minifiedAjax()
            ->dom('Brtip')
            ->orderBy(0)
            ->selectStyleSingle()
            ->parameters([
                'language' => [
                    'lengthMenu' => 'Hiển thị _MENU_ mục mỗi trang',
                    'zeroRecords' => 'Không tìm thấy dữ liệu',
                    'info' => 'Hiển thị _START_ đến _END_ của _TOTAL_ mục',
                    'infoEmpty' => 'Không có mục nào để hiển thị',
                    'infoFiltered' => '(lọc từ _MAX_ tổng số mục)',
                    'search' => 'Tìm kiếm:',
                    'paginate' => [
                        'first' => 'Đầu',
                        'last' => 'Cuối',
                        'next' => 'Tiếp',
                        'previous' => 'Trước'
                    ]
                ]
            ])
            ->buttons([
                Button::make('print'),
                Button::make('reset'),
                Button::make('reload')
            ]);
    }

    public function getColumns(): array
    {
        $columns = [
            Column::make('DT_RowIndex')->title('STT')->orderable(false)->searchable(false),
        ];

        $columns = array_merge($columns, method_exists($this, 'extraColumns') ? $this->extraColumns() : []);

        if ($this->hasStatus) {
            $columns[] = Column::make('status')->title('Trạng thái');
        }

        if ($this->hasActions) {
            $columns[] = Column::computed('action')->title('Hành động')->exportable(false)->printable(false)->width(60)->addClass('text-center');
        }

        return $columns;
    }

    protected function filename(): string
    {
        return ucfirst($this->routeName) . '_' . date('YmdHis');
    }
}
