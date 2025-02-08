<?php

namespace App\DataTables\Product;

use App\Enums\Product\ProductStatus;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder as QueryBuilder;
use Yajra\DataTables\EloquentDataTable;
use Yajra\DataTables\Html\Builder as HtmlBuilder;
use Yajra\DataTables\Html\Button;
use Yajra\DataTables\Html\Column;
use Yajra\DataTables\Html\Editor\Editor;
use Yajra\DataTables\Html\Editor\Fields;
use Yajra\DataTables\Services\DataTable;

class ProductDataTable extends DataTable
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
            ->addColumn('action', function ($product) {
                $editUrl = route('admin.product.edit', $product->id);
                $deleteUrl = route('admin.product.destroy', $product->id);
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
            ->editColumn('status', function ($product) {
                $statusEnum = ProductStatus::fromValue($product->status);
                return $statusEnum->badge();
            })
            // ->editColumn('created_at', function ($product) {
            //     return Carbon::parse($product->created_at)->format('d-m-Y');
            // })
            // ->editColumn('updated_at', function ($product) {
            //     return Carbon::parse($product->updated_at)->format('d-m-Y');
            // })
            ->editColumn('image', function ($product) {
                return '<image class="rounded mx-auto d-block image-cover" src="' . $product->skus[0]->image_url . '" style="width: 50px; height: 50px;"/>';
            })
            ->editColumn('price', function ($product) {
                $price = $product->price ?? 0;
                $formattedPrice = number_format($price, 0, '.', '.');
                return '<div class="price" data-sort="' . $price . '">' . $formattedPrice . ' VNĐ</div>';
            })

            ->setRowId('id')
            ->rawColumns(['status', 'action', 'image', 'price']);
    }

    /**
     * Get the query source of dataTable.
     */
    public function query(Product $model): QueryBuilder
    {
        return $model->newQuery()
            ->leftJoin('skus', 'products.id', '=', 'skus.product_id')
            ->select('products.*', \DB::raw('MIN(skus.price) as price'))
            ->groupBy('products.id');
    }

    /**
     * Optional method if you want to use the html builder.
     */
    public function html(): HtmlBuilder
    {
        return $this->builder()
            ->setTableId('products-table')
            ->columns($this->getColumns())
            ->minifiedAjax()
            // ->dom('Brtip')
            // ->pageLength(8)
            // ->pagingType('full_numbers')
            ->orderBy(1)
            ->selectStyleSingle()
            ->parameters([
                'language' => [
                    'lengthMenu' => 'Hiển thị _MENU_ mục mỗi trang',
                    'zeroRecords' => 'Không tìm thấy dữ liệu',
                    'info' => 'Hiển thị _START_ đến _END_ của _TOTAL_ sản phẩm',
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
                // Button::make('excel'),
                // Button::make('csv'),
                // Button::make('pdf'),
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
            Column::make('name')->title("Tên sản phẩm"),
            Column::make('short_description')->title("Mô tả ngắn"),
            Column::make('status')->title("Trạng thái"),
            Column::make('price')->title("Giá")->orderable(true)->width(200),
            // Column::make('created_at')->title('Ngày thêm')->width(150),
            // Column::make('updated_at')->title('Ngày cập nhật')->width(150),
            Column::computed('action')
                ->title('Hành động')
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
        return 'Products_' . date('YmdHis');
    }
}
