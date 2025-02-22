<?php

namespace App\Http\Controllers\Admin\Category;

use App\DataTables\Category\CategoryDataTable;
use App\Enums\Category\CategoryStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Category\CategoryRequest;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
        $status = CategoryStatus::getKeyValuePairs();
        return view('Pages.Category.Create', ['categories' => $categories, 'status' => $status]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CategoryRequest $request)
    {
        // dd($request);
        try {
            $data = [
                'name' => $request->name,
                'short_description' => $request->short_description,
                'status' => $request->status,
                'parent_id' => $request->parent_id,
                'image' => 'đasadasd',
            ];

            if (isset($request->slug) && !empty($request->slug)) {
                $data['slug'] = $request->slug;
            } else {
                $data['slug'] = Str::slug($request->name);
            }

            $path = null;

            if ($request->hasFile('image')) {
                $path = Storage::disk('public')->put('category_images', $request->image);
                $data['image'] = 'storage/' . $path;
            } else {
                $data['image'] = config(key: 'settings.image_default');
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
        $categories = Category::all();
        $statusEnum = CategoryStatus::fromValue($category->status);
        $sta = [
            'value' => $statusEnum->value,
            'label' =>  $statusEnum->label()
        ];

        $categoryActive = Category::findOrFail($category->parent_id);

        $status = mapEnumToArray(CategoryStatus::class, $category->status);

        // dd($category);
        return view('Pages.Category.Edit', ['category' => $category, 'categories' => $categories, 'status' => $status, 'sta' => $sta, 'categoryActive' => $categoryActive]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        dd($request);
        try {
            $data = $request->all();

            if ($request->hasFile('image')) {
                if (!empty($category->image) && Str::contains($category->image, 'storage')) {
                    $oldPath = str_replace('storage/', '', $category->image);
                    Storage::disk('public')->delete($oldPath);
                }

                $path = $request->file('image')->store('post_images', 'public');
                $data['image'] = 'storage/' . $path;
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
    public function destroy(Category $category)
    {
        try {
            if (Str::contains($category->image, 'storage')) {
                $path = str_replace('storage/', '', $category->image);
                Storage::disk('public')->delete($path);
            }

            $category->delete();

            return redirect()->route('admin.category.index')->with('success', 'Xóa danh mục thành công');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
