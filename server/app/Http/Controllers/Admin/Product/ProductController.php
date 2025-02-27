<?php

namespace App\Http\Controllers\Admin\Product;

use App\Enums\Product\ProductStatus;
use App\Http\Controllers\Controller;
use App\Models\ProductCategory;
use Illuminate\Http\Request;
use App\DataTables\Product\ProductDataTable;
use App\Http\Requests\Admin\Product\ProductRequest;
use App\Models\Category;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\Variant;
use App\Models\Product;
use App\Models\Sku;
use App\Models\SkuVariant;

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
        $variants = Variant::with('values')->get();

        $productStatusData = mapEnumToArray(ProductStatus::class);

        $categories = Category::all();

        $categoryTree = flattenCategories($categories);

        // dd($variants);

        return view('Pages.Product.Create', ['productStatus' => $productStatusData, 'variants' => $variants, 'categories' => $categoryTree]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // dd($request);
        try {
            \DB::beginTransaction();

            $product = Product::create([
                'name' => $request->name,
                'short_description' => $request->short_description,
                'description' => $request->description,
                'is_hot' => $request->is_hot ?? 0,
                'status' => $request->status,
                'admin_id' => auth()->id() ?? 1,
                'slug' => $request->slug ? Str::slug($request->slug) : Str::slug($request->name),
            ]);

            if (isset($request->categories)) {
                foreach ($request->categories as $cate) {
                    ProductCategory::insert(['product_id' => $product->id, 'category_id' => $cate]);
                }
            }

            if (!empty($request->variants)) {
                foreach ($request->variants as $key => $variantData) {
                    $sku = Sku::create([
                        'product_id' => $product->id,
                        'sku_code' => "SKU-" . strtoupper(Str::random(8)),
                        'price' => $variantData['price'] ?? 0,
                        'promotion_price' => $variantData['promotion_price'] ?? 0,
                        'quantity' => $variantData['quantity'] ?? 0,
                        'image_url' => $this->uploadImage($request, "variants.$key.image"),
                    ]);

                    if (!empty($variantData['variant_values'])) {
                        foreach ($variantData['variant_values'] as $variantValueId) {
                            SkuVariant::create([
                                'sku_id' => $sku->id,
                                'variant_value_id' => $variantValueId,
                            ]);
                        }
                    }
                }
            }

            \DB::commit();
            return redirect()->route('admin.product.index')->with('success', 'Sản phẩm đã được thêm thành công!');
        } catch (\Exception $e) {
            \DB::rollBack();
            return redirect()->back()->with('error', $e->getMessage());
        }
    }



    /**
     * Hàm hỗ trợ upload hình ảnh
     */
    private function uploadImage($request, $key, $currentImage = null)
    {
        if ($request->hasFile($key)) {
            $path = Storage::disk('public')->put('product_images', $request->file($key));
            return '/storage/' . $path;
        }
        return $currentImage ?? config('settings.image_default');
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
        $productStatus = ProductStatus::fromValue($product->status);
        $sta = [
            'value' => $productStatus->value,
            'label' =>  $productStatus->label()
        ];

        $status = mapEnumToArray(ProductStatus::class, $product->status);

        $variants = Variant::with('values')->get();
        $skus = Sku::where('product_id', $product->id)->with('variantValues')->get();
        // dd($productStatus);
        $categories = Category::all();

        return view('Pages.Product.Edit', compact('product', 'variants', 'skus', 'categories', 'status', 'sta'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        try {
            \DB::beginTransaction();

            $product->update([
                'name' => $request->name,
                'short_description' => $request->short_description,
                'description' => $request->description,
                'is_hot' => $request->is_hot ?? 0,
                'status' => $request->status,
                'admin_id' => auth()->id() ?? 1,
                'slug' => $request->slug ? Str::slug($request->slug) : Str::slug($request->name),
            ]);

            if ($request->has('categories')) {
                ProductCategory::where('product_id', $product->id)->delete();
                foreach ($request->categories as $cate) {
                    ProductCategory::create([
                        'product_id' => $product->id,
                        'category_id' => $cate
                    ]);
                }
            }

            $existingSkus = $product->skus->pluck('id')->toArray();
            $newSkus = [];

            if (!empty($request->variants)) {
                foreach ($request->variants as $key => $variantData) {
                    $sku = Sku::where('product_id', $product->id)
                        ->whereHas('skuVariants', function ($query) use ($variantData) {
                            $query->whereIn('variant_value_id', $variantData['variant_values'] ?? []);
                        })
                        ->first();

                    if (!$sku) {
                        $sku = Sku::create([
                            'product_id' => $product->id,
                            'sku_code' => "SKU-" . strtoupper(Str::random(8)),
                            'price' => $variantData['price'] ?? 0,
                            'promotion_price' => $variantData['promotion_price'] ?? 0,
                            'quantity' => $variantData['quantity'] ?? 0,
                            'image_url' => $this->uploadImage($request, "variants.$key.image"),
                        ]);
                    } else {
                        $sku->update([
                            'price' => $variantData['price'] ?? 0,
                            'promotion_price' => $variantData['promotion_price'] ?? 0,
                            'quantity' => $variantData['quantity'] ?? 0,
                            'image_url' => $request->hasFile("variants.$key.image")
                                ? $this->uploadImage($request, "variants.$key.image", $sku->image_url)
                                : $sku->image_url, 
                        ]);
                    }

                    $newSkus[] = $sku->id;

                    SkuVariant::where('sku_id', $sku->id)->delete();

                    if (!empty($variantData['variant_values'])) {
                        foreach ($variantData['variant_values'] as $variantValueId) {
                            SkuVariant::create([
                                'sku_id' => $sku->id,
                                'variant_value_id' => $variantValueId,
                            ]);
                        }
                    }
                }
            }

            $skusToDelete = array_diff($existingSkus, $newSkus);
            Sku::whereIn('id', $skusToDelete)->delete();

            \DB::commit();
            return redirect()->route('admin.product.index')->with('success', 'Sản phẩm đã được cập nhật thành công!');
        } catch (\Exception $e) {
            \DB::rollBack();
            return redirect()->back()->with('error', $e->getMessage());
        }
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Product $product)
    {
        try {

            foreach ($product->skus as $sku) {
                if ($sku->image_url && Str::contains($sku->image_url, 'storage')) {
                    $path = str_replace('storage/', '', $sku->image_url);
                    Storage::disk('public')->delete($path);
                }
            }

            $product->skus()->delete();

            $product->delete();

            if ($request->ajax()) {
                return response()->json(['type' => 'success', 'redirect' => route('admin.product.index')]);
            }

            return redirect()->route('admin.product.index')->with('success', 'Xóa sản phẩm thành công');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }


    private function flattenCategories($categories, $parentId = 0, $depth = 0)
    {
        $flattened = [];

        foreach ($categories as $category) {
            if ($category->parent_id == $parentId) {
                $category->depth = $depth;
                $flattened[] = $category;

                $flattened = array_merge($flattened, $this->flattenCategories($categories, $category->id, $depth + 1));
            }
        }

        return $flattened;
    }
}
