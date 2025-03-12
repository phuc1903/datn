<?php

namespace App\DataTables;

use Yajra\DataTables\Services\DataTable;
use Yajra\DataTables\EloquentDataTable;
use Illuminate\Database\Eloquent\Builder as QueryBuilder;
use Yajra\DataTables\Html\Builder as HtmlBuilder;
use Yajra\DataTables\Html\Column;
use Yajra\DataTables\Html\Button;
use Carbon\Carbon;

abstract class BaseDataTable extends DataTable
{
    protected bool $includeAction = true;
    protected bool $includeCreatedAt = true;
    protected bool $includeUpdatedAt = true;
    protected string $routeName = '';
    protected string $tableId = '';

    protected int $orderBy = 2;

    protected bool $deleteItem = true;

    /**
     * Build the DataTable class.
     *
     * @param QueryBuilder $query
     */
    public function dataTable(QueryBuilder $query): EloquentDataTable
    {
        $dataTable = new EloquentDataTable($query);
        $dataTable->addIndexColumn();

        $editableColumns = [];

        $dataTable = $this->customizeDataTable($dataTable);

        if ($this->includeAction) {
            $dataTable->addColumn('action', fn($row) => $this->actionButtons($row));
            $editableColumns[] = 'action';
        }

        if ($this->includeCreatedAt) {
            $dataTable->editColumn('created_at', fn($row) => Carbon::parse($row->created_at)->format('d-m-Y'));
            $editableColumns[] = 'created_at';
        }

        if ($this->includeUpdatedAt) {
            $dataTable->editColumn('updated_at', fn($row) => Carbon::parse($row->updated_at)->format('d-m-Y'));
            $editableColumns[] = 'updated_at';
        }

        // Thêm các cột có chỉnh sửa từ customizeDataTable()
        $editableColumns = array_merge($editableColumns, $this->getEditableColumns());

        return $dataTable
            ->setRowId('id')
            ->rawColumns($editableColumns);
    }

    /**
     * Lấy danh sách các cột đã chỉnh sửa
     */
    protected function getEditableColumns(): array
    {
        return [];
    }

    /**
     * Lớp con có thể ghi đè để tùy chỉnh DataTable.
     */
    protected function customizeDataTable(EloquentDataTable $dataTable): EloquentDataTable
    {
        return $dataTable;
    }


    /**
     * Get the query source of dataTable.
     */
    abstract public function query(): QueryBuilder;

    /**
     * Optional method if you want to use the HTML builder.
     */
    public function html(): HtmlBuilder
    {
        return $this->builder()
            ->setTableId($this->tableId)
            ->columns($this->getColumns())
            ->minifiedAjax('', null, [
                'provinces' => "$('#provinces').val();",
                'districts' => "$('#districts').val();",
                'wards' => "$('#wards').val();",
            ])
            ->dom('Brtip')
            ->orderBy($this->orderBy)
            ->selectStyleSingle()
            ->parameters($this->parametersSettings())
            ->buttons($this->getButtons());
    }

    protected function getButtons(): array
    {
        return [
            // Button::make('excel'),
            // Button::make('csv'),
            // Button::make('pdf'),
            Button::make('print'),
            // Button::make('reset'),
            Button::make('reload')
        ];
    }

    /**
     * Get action buttons.
     */
    protected function actionButtons($row): string
    {
        $editUrl = route('admin.' . $this->routeName . '.edit', $row->id);
        $deleteUrl = route('admin.' . $this->routeName . '.destroy', $row->id);

        $buttons = '<div class="d-flex gap-2">
        <a class="btn btn-warning text-white" href="' . $editUrl . '">Sửa</a>';

        if (!$this->deleteItem) {
            $buttons .= '<form action="' . $deleteUrl . '" method="POST" class="d-inline">
            ' . csrf_field() . method_field('DELETE') . '
            <button type="submit" class="btn btn-danger text-white">Xóa</button>
        </form>';
        } else {
            $buttons .= '<button type="button" class="btn btn-danger text-white deleteItem" 
            data-route-delete="' . $deleteUrl . '" data-id-table="' . $this->tableId . '">Xóa</button>';
        }

        $buttons .= '</div>';

        return $buttons;
    }


    protected function parametersSettings(): array
    {
        return [
            'language' => [
                'lengthMenu' => 'Hiển thị _MENU_ mục mỗi trang',
                'zeroRecords' => 'Không tìm thấy dữ liệu',
                'info' => 'Hiển thị _START_ đến _END_ của _TOTAL_ mục',
                'infoEmpty' => 'Không có mục nào để hiển thị',
                'infoFiltered' => '(lọc từ _MAX_ tổng số mục)',
                'search' => 'Tìm kiếm:',
                'paginate' => [
                    'first' => 'Đến đầu trang',
                    'last' => 'Đến cuối trang',
                    'next' => 'Tiếp theo',
                    'previous' => 'Về sau'
                ]
            ],
            'theme' => 'bootstrap5',
            'initComplete' => 'function() {
                const table = this.api();

                const $thead = $(table.table().header());

                const $filterRow = $thead.find("tr").clone().addClass("filter");

                $filterRow.find("th").each(function() {
                    const $currentTh = $(this);

                    if (!$currentTh.hasClass("no-search")) {

                        const input = $(`<input type="text" class="form-control form-control-sm" placeholder="Tìm kiếm ${$currentTh.text()}" /> `);
                        $currentTh.html(input);

                        $(input).on("click", function(event) {
                            event.stopPropagation();
                        });

                        $(input).on("keyup change clear", function() {
                            if (table.column($currentTh.index()).search() !== this.value) {
                                table.column($currentTh.index()).search(this.value).draw();
                            }
                        });

                    } else {
                        $currentTh.empty();
                    }

                });

                $thead.append($filterRow);


                // for the date filter
                $("#provinces, #districts, #wards").on("change", function() {
                    const provinces = $("#provinces").val();
                    const districts = $("#districts").val();
                    const wards = $("#wards").val();

                    if (provinces && districts && wards) {
                        table.ajax.reload();
                    }
                });

            }'
        ];
    }

    protected function getSearchColumn(): array
    {
        return [];
    }

    /**
     * Get columns for DataTable.
     */
    protected function getColumns(): array
    {
        $columns = [
            Column::make('DT_RowIndex')->title('STT')->orderable(false)->searchable(false)->addClass('no-search'),
        ];

        // Thêm cột đặc trưng của bảng con trước
        $columns = array_merge($columns, $this->extraColumns());

        if ($this->includeCreatedAt) {
            $columns[] = Column::make('created_at')->title('Ngày tạo')->width(150)->addClass('no-search');
        }

        if ($this->includeUpdatedAt) {
            $columns[] = Column::make('updated_at')->title('Ngày cập nhật')->width(150)->addClass('no-search');
        }

        if ($this->includeAction) {
            $columns[] = Column::computed('action')
                ->title('Hành động')
                ->exportable(false)
                ->printable(false)
                ->width(60)
                ->addClass('text-center no-search');
        }

        return $columns;
    }


    /**
     * Lớp con có thể ghi đè để thêm cột mới.
     */
    protected function extraColumns(): array
    {
        return [];
    }
}
