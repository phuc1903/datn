<?php

namespace App\Http\Controllers\Admin\Product;

use App\DataTables\Product\VariantDataTable;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Product\VariantRequest;
use App\Models\Variant;
use App\Models\VariantValue;
use Illuminate\Http\Request;

class VariantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(VariantDataTable $datatable)
    {
        return $datatable->render('Pages.Product.Variant.Index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('Pages.Product.Variant.Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(VariantRequest $request)
    {
        try {
            $variant = Variant::create(['name' => $request->name]);

            if ($request->has('variants') && is_array($request->variants)) {
                foreach ($request->variants as $value) {
                    VariantValue::create([
                        'variant_id' => $variant->id,
                        'value' => $value['value'] ?? null,
                    ]);
                };
            };
            return redirect()->route('admin.variant.index')->with('success', 'Thêm thuộc tính thành công');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Variant $variant)
    {
        $variant->load('values');
        return response()->json(['type' => 'success', 'values' => $variant->values]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Variant $variant)
    {
        $variant->load('values');
        // dd($variant);
        return view('Pages.Product.Variant.Edit', compact('variant'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(VariantRequest $request, Variant $variant)
    {
        try {

            $variant->update(['name' => $request->name]);

            if ($request->has('variants') && is_array($request->variants)) {
                VariantValue::where('variant_id', $variant->id)->delete();

                foreach ($request->variants as $value) {
                    VariantValue::create([
                        'variant_id' => $variant->id,
                        'value' => $value['value'] ?? null,
                    ]);
                }
            }

            return redirect()->back()->with('success', 'Cập nhật thuộc tính thành công');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Variant $variant)
    {
        try {
            $variant->delete();

            if ($request->ajax()) {
                return response()->json(['type' => 'success', 'redirect' => route('admin.variant.index')]);
            }

            return redirect()->route('admin.variant.index')->with('success', 'Xóa biến thể thành công');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
