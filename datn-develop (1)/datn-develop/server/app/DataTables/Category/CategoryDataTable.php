<?php

namespace App\DataTables\Category;

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
use Yajra\DataTables\Services\DataTable;

class CategoryDataTable extends DataTable
{
    /**
     * Build the DataTable class.
     *
     * @param QueryBuilder $query Results from query() method.
     */
    public function dataTable(QueryBuilder $query): EloquentDataTable
    {
        return (new EloquentDataTable($query))
            ->addIndexColumn()
            ->addColumn('action', function ($category) {
                $editUrl = route('admin.category.edit', $category->id);
                $deleteUrl = route('admin.category.destroy', $category->id);
                return '
                    <div class="d-flex gap-2">
                        <a class="btn btn-warning text-white" href="' . $editUrl . '">Sửa</a>
                        <form action="' . $deleteUrl . '" method="POST" class="btn btn-danger ml-2">
                            ' . csrf_field() . method_field('DELETE') . '
                            <button type="submit" class="bg-transparent border-0 text-white">Xóa</button>
                        </form>
                    </div>
                ';
            })
            ->editColumn('status', function ($category) {
                $statusEnum = CategoryStatus::fromValue($category->status);
                return $statusEnum->badge();
            })
            ->editColumn('created_at', function ($category) {
                return Carbon::parse($category->created_at)->format('d-m-Y');
            })
            ->editColumn('updated_at', function ($category) {
                return Carbon::parse($category->updated_at)->format('d-m-Y');
            })
            ->editColumn('image', function ($category) {
                return '<img class="rounded mx-auto d-block image-cover image-table" src="' . $category->image . '"/>';
            })
            ->setRowId('id')
            ->rawColumns(['status', 'action', 'image']);
    }

    /**
     * Get the query source of dataTable.
     */
    public function query(Category $model): QueryBuilder
    {
        return $model->newQuery();
    }

    /**
     * Optional method if you want to use the html builder.
     */
    public function html(): HtmlBuilder
    {
        return $this->builder()
            ->setTableId('category-table')
            ->columns($this->getColumns())
            ->minifiedAjax()
            //->dom('Bfrtip')
            ->orderBy(2)
            ->selectStyleSingle()
            ->parameters([
                'language' => [
                    'lengthMenu' => 'Hiển thị _MENU_ mục mỗi trang',
                    'zeroRecords' => 'Không tìm thấy dữ liệu',
                    'info' => 'Hiển thị _START_ đến _END_ của _TOTAL_ danh mục',
                    'infoEmpty' => 'Không có mục nào để hiển thị',
                    'infoFiltered' => '(lọc từ _MAX_ tổng số mục)',
                    'search' => 'Tìm kiếm:',
                    'paginate' => [
                        'first' => 'Đến đầu trang',
                        'last' => 'Đến cuối trang',
                        'next' => 'Tiếp theo',
                        'previous' => 'Về sau'
                    ]
                ]
            ])
            ->buttons([
                Button::make('excel'),
                Button::make('csv'),
                Button::make('pdf'),
                Button::make('print'),
                Button::make('reset'),
                Button::make('reload')
            ]);
    }

    /**
     * Get the dataTable columns definition.
     */
    public function getColumns(): array
    {
        return [
            Column::make('DT_RowIndex')->title('STT')->orderable(false)->searchable(false),
            Column::make('image')->title('Ảnh')->orderable(false)->searchable(false),
            Column::make('name')->title('Tên danh mục'),
            Column::make('status')->title('Trạng thái'),
            Column::make('created_at')->title('Ngày thêm')->width(150),
            Column::make('updated_at')->title('Ngày cập nhật')->width(150),
            Column::computed('action')
                ->exportable(false)
                ->printable(false)
                ->width(60)
                ->addClass('text-center'),
        ];
    }

    /**
     * Get the filename for export.
     */
    protected function filename(): string
    {
        return 'Category_' . date('YmdHis');
    }
}
