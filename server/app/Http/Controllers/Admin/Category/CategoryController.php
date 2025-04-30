<?php

namespace App\Http\Controllers\Admin\Category;

use App\DataTables\Category\CategoryDataTable;
use App\Enums\Category\CategoryStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Category\CategoryRequest;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(CategoryDataTable $dataTables)
    {
        return $dataTables->render('Pages.Category.Index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::all();
        $cateFlat = flattenCategories($categories);
        $status = CategoryStatus::getKeyValuePairs();
        return view('Pages.Category.Create', ['categories' => $cateFlat, 'status' => $status]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CategoryRequest $request)
    {
        // dd($request);
        try {
            if ($request->hasFile('image')) {
                // $path = Storage::disk('public')->put('category_images', $request->image);
                $pathImage = putImage('category_images',$request->image);
            } else {
                $pathImage = config('settings.image_default');
            }
            $data = [
                'name' => $request->name,
                'short_description' => $request->short_description,
                'status' => $request->status,
                'parent_id' => $request->parent_id,
                'image' => $pathImage,
            ];

            if (isset($request->slug) && !empty($request->slug)) {
                $data['slug'] = $request->slug;
            } else {
                $data['slug'] = Str::slug($request->name);
            }

            Category::create($data);
            

            return redirect()->route('admin.category.index')->with('success', 'Thêm danh mục thành công');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }




    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        // dd($category);
        $categories = Category::all();

        $cateFlat = flattenCategories($categories);
        $statusEnum = CategoryStatus::fromValue(enumValue: $category->status);
        $sta = [
            'value' => $statusEnum->value,
            'label' =>  $statusEnum->label()
        ];
        $categoryActive = $category->parent_id ? Category::find($category->parent_id) : null;
        $status = mapEnumToArray(CategoryStatus::class, $category->status);

        // dd($status);
        return view('Pages.Category.Edit', ['category' => $category, 'categories' => $cateFlat, 'status' => $status, 'sta' => $sta, 'categoryActive' => $categoryActive]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CategoryRequest $request, Category $category)
    {
        // dd($request);
        try {
            $data = $request->all();

            if ($request->hasFile('image')) {
                if (!empty($category->image) && Str::contains($category->image, 'storage')) {
                    $oldPath = str_replace('storage/', '', $category->image);
                    Storage::disk('public')->delete($oldPath);
                }

                $path = $request->file('image')->store('category_images', 'public');
                $data['image'] = '/storage/' . $path;
            }

            $category->update($data);

            return redirect()->back()->with('success', 'Cập nhật danh mục thành công.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Lỗi: ' . $e->getMessage());
        }
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Category $category)
    {
        try {
     
            deleteImage($category->image);

            $category->delete();

            if ($request->ajax()) {
                return response()->json(['type' => 'success', 'redirect' => route('admin.category.index')]);
            }

            return redirect()->route('admin.category.index')->with('success', 'Xóa danh mục thành công');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
