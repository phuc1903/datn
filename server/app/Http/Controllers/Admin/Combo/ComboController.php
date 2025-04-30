<?php

namespace App\Http\Controllers\Admin\Combo;

use App\DataTables\Combo\ComboDataTable;
use App\Enums\Combo\ComboHot;
use App\Enums\Combo\ComboStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Combo\ComboRequest;
use App\Models\Category;
use App\Models\Combo;
use App\Models\ComboProducts;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\Sku;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ComboController extends Controller
{
    public function index(ComboDataTable $dataTable)
    {
        return $dataTable->render('Pages.Combo.Index');
    }

    public function create(Request $request)
    {
        $skus = Sku::with('product', 'variantValues')->get();

        $categories = Category::all();

        $status = ComboStatus::getKeyValuePairs();
        $hots = ComboHot::getKeyValuePairs();

        return view('Pages.Combo.Create', compact('skus', 'categories', 'status', 'hots'));
    }

    public function store(ComboRequest $request)
    {
        try {
            if ($request->has('quantity')) {
                $requestedQty = (int) $request->quantity;
            
                $skus = Sku::whereIn('id', $request->skus)->get();
            
                foreach ($skus as $item) {
                    if ($item->quantity < $requestedQty + 4) {
                        return redirect()->back()->with('error', 'Sản phẩm '.$item->id.' không đủ số lượng');
                    }
                    $quantitySkuNew = $item->quantity - $requestedQty;
                    $item->update(['quantity' => $quantitySkuNew]);
                }
            }

            if ($request->hasFile('image_url')) {
                $pathImage = putImage('combo_images', $request->image_url);
            } else {
                $pathImage = config('settings.image_default');
            }

            $combo = Combo::create([
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



            if (isset($request->categories)) {
                foreach ($request->categories as $cate) {
                    ProductCategory::insert(['combo_id' => $combo->id, 'category_id' => $cate]);
                }
            }

            if ($request->has('skus')) {
                foreach ($request->skus as $sku) {
                    ComboProducts::create([
                        'combo_id' => $combo->id,
                        'sku_id' => $sku,
                        'quantity' => $request->quantity,
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
        $combo->load('skus', 'skus.variantValues')->get();

        $skus = Sku::with('product', 'variantValues')->get();

        $categories = Category::all();

        $comboStatus = ComboStatus::fromValue($combo->status);
        $sta = [
            'value' => $comboStatus->value,
            'label' =>  $comboStatus->label()
        ];

        $status = mapEnumToArray(ComboStatus::class, $combo->status);


        $comboHot = ComboHot::fromValue($combo->is_hot);
        $h = [
            'value' => $comboHot->value,
            'label' =>  $comboHot->label()
        ];

        $hot = mapEnumToArray(ComboHot::class, $combo->status);


        return view(
            'Pages.Combo.Edit',
            compact(
                'combo',
                'status',
                'sta',
                'h',
                'hot',
                'categories',
                'skus',
            )
        );
    }

    public function update(ComboRequest $request, Combo $combo)
    {
        // dd($request);
        try {
            if ($request->hasFile('image_url')) {
                if ($combo->image_url) deleteImage($combo->image_url);
                $pathImage = putImage('combo_images', $request->image_url);
            } else {
                $pathImage = $combo->image_url ?? config('settings.image_default');
            }

            $combo->update([
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


            if ($request->has('skus')) {
                ComboProducts::where('combo_id', $combo->id)->delete();
    
                foreach ($request->skus as $sku) {
                    ComboProducts::create([
                        'combo_id' => $combo->id,
                        'sku_id' => $sku,
                        'quantity' => 1
                    ]);
                }
            }

            if ($request->has('categories')) {
                ProductCategory::where('combo_id', $combo->id)->delete();
                foreach ($request->categories as $cate) {
                    ProductCategory::create([
                        'combo_id' => $combo->id,
                        'category_id' => $cate
                    ]);
                }
            }

            return redirect()->back()->with('success', 'Cập nhật combo thành công');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function destroy(Request $request, Combo $combo) {
        try {
            
            deleteImage($combo->image_url);

            $combo->delete();

            if ($request->ajax()) {
                return response()->json(['type' => 'success', 'redirect' => route('admin.combo.index')]);
            }

        }catch(\Exception $e) {
            return redirect()->back()->with('erorr', $e->getMessage());
        }
    }
}
