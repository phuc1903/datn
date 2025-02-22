<?php

namespace App\Http\Controllers\Admin\Product;

use App\Enums\Product\ProductStatus;
use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use App\DataTables\Product\ProductDataTable;
use App\Http\Requests\Admin\Product\ProductRequest;
use App\Models\Variant;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(ProductDataTable $datatables)
    {
        return $datatables->render('Pages.Product.Index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $variants = Variant::all();

        // dd($variants);

        $productStatusData = mapEnumToArray(ProductStatus::class);

        // dd($productStatusData);

        return view('Pages.Product.Create', ['productStatus' => $productStatusData, 'variants' => $variants]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        dd($request);
        // $data = $request->validated();
        // session()->flash('success', 'Sản phẩm đã được thêm thành công!');

        return redirect()->route('admin.product.index')->with('success', 'Sản phẩm đã được thêm thành công!');;
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        //
    }
}
