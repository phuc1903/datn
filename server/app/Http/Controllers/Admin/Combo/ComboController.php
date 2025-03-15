<?php

namespace App\Http\Controllers\Admin\Combo;

use App\DataTables\Combo\ComboDataTable;
use App\Enums\Combo\ComboHot;
use App\Enums\Combo\ComboStatus;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Combo;
use App\Models\ComboProducts;
use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ComboController extends Controller
{
    public function index(ComboDataTable $dataTable)
    {
        return $dataTable->render('Pages.Combo.Index');
    }

    public function create()
    {

        $products = Product::with('skus', 'skus.variantValues')->limit(10)->get();

        $categories = Category::all();

        $status = ComboStatus::getKeyValuePairs();
        $hots = ComboHot::getKeyValuePairs();

        return view('Pages.Combo.Create', compact('products', 'categories', 'status', 'hots'));
    }

    public function store(Request $request)
    {
        try {

            if ($request->hasFile('image_url')) {
                $pathImage = putImage('combo_images', $request->image_url);
            } else {
                $pathImage = config('settings.image_default');
            }


            $product = Combo::create([
                'admin_id' => auth()->id(),
                'name' => $request->name,
                'slug' => $request->slug ?: Str::slug($request->name), 
                'short_description' => $request->short_description,
                'description' => $request->description,
                'is_hot' => $request->is_hot,
                'price' => $request->price,
                'promotion_price' => $request->promotion_price,
                'quantity' => $request->quantity,
                'date_start' => $request->date_start,
                'date_end' => $request->date_end,
                'status' => $request->status,
                'image_url' => $pathImage,
            ]);


            if ($request->has('categories')) {
                foreach ($request->categories as $cate) {
                    ProductCategory::insert(['combo_id' => $product->id, 'category_id' => $cate]);
                }
            }

            if ($request->has('skus')) {
                foreach ($request->skus as $sku) {
                    ComboProducts::create([
                        'combo_id' => $product->id,
                        'sku_id' => $sku,
                        'quantity' => 1
                    ]);
                }
            }

            return redirect()->route('admin.combo.index')->with('success', 'Thêm combo thành công');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }


    public function edit(Combo $combo)
    {
        dd($combo->load('skus', 'skus.product'));
    }

    public function update() {}

    public function destroy() {}
}
