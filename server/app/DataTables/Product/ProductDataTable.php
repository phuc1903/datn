<?php

namespace App\DataTables\Product;

use App\Enums\Product\ProductStatus;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Support\Str;
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
            ->editColumn('status', function ($model) {
                $statusEnum = ProductStatus::fromValue($model->status);
                return $statusEnum->badge();
            })
            ->editColumn('created_at', function ($product) {
                return Carbon::parse($product->created_at)->format('Y-m-d');
            })
            // ->editColumn('updated_at', function ($product) {
            //     return Carbon::parse($product->updated_at)->format('d-m-Y');
            // })
            ->editColumn('image', function ($product) {
                $imageUrl = optional($product->skus->first())->image_url ?? asset('default-image.jpg');
                return '<img class="rounded mx-auto d-block image-cover image-table" src="' . asset($imageUrl) . '"/>';
            })
            ->editColumn('price', function ($product) {
                $price = $product->price ?? 0;
                return number_format($price, 0, ',', '.') . ' VNĐ';
            })
            ->editColumn('short_description', function ($product) {
                return Str::limit($product->short_description, 50, '...');
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
            ->select(
                'products.id',
                'products.name',
                'products.short_description',
                'products.status',
                'products.created_at',
                \DB::raw('COALESCE(MIN(skus.price), 0) as price')
            )
            ->leftJoin('skus', 'products.id', '=', 'skus.product_id')
            ->groupBy('products.id', 'products.name', 'products.short_description', 'products.status', 'products.created_at');
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
            ->orderBy(6)
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
            Column::make('price')->title("Giá")->orderable(true)->width(200)->type("num"),
            Column::make('created_at')->title('Ngày thêm')->width(150)->type("date"),
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
