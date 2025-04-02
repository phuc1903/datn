<?php

namespace App\Http\Controllers\Admin\Blog;

use App\DataTables\Blog\BlogDataTable;
use App\Enums\Blog\BlogStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Blog\BlogRequest;
use App\Models\Blog;
use App\Models\BlogProduct;
use App\Models\BlogTag;
use App\Models\Product;
use App\Models\Sku;
use App\Models\Tag;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BlogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(BlogDataTable $dataTable)
    {
        return $dataTable->render('Pages.Blog.Index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $products = Product::with('skus')->get();
        $status = BlogStatus::getKeyValuePairs();
        $tags = Tag::all();
        return view('Pages.Blog.Create', compact('status', 'tags', 'products'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(BlogRequest $request)
    {
        try {
            $data = [
                'title' => $request->title,
                'short_description' => $request->short_description,
                'description' => $request->description,
                'status' => $request->status,
                'admin_id' => auth()->id() ?? 1,
            ];

            if (isset($request->slug) && !empty($request->slug)) {
                $data['slug'] = $request->slug;
            } else {
                $data['slug'] = Str::slug($request->title);
            }

            if ($request->hasFile('image_url')) {
                $data['image_url'] = putImage('blog_images', $request->image_url);
            } else {
                $data['image_url'] = config('settings.image_default');
            }

            $blog = Blog::create($data);

            if (isset($request->tags) && !empty($request->tags)) {
                foreach ($request->tags as $tag) {
                    BlogTag::create(['blog_id' => $blog->id, 'tag_id' => $tag]);
                }
            }

            if (isset($request->products) && !empty($request->products)) {
                foreach ($request->products as $product) {
                    BlogProduct::create([
                        'product_id' => $product,
                        'blog_id' => $blog->id,
                    ]);
                }
            }

            return redirect()->route('admin.blog.index')->with('success', 'Thêm bài viết thành công');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Blog $blog)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Blog $blog)
    {
        $statusEnum = BlogStatus::fromValue($blog->status);
        $sta = [
            'value' => $statusEnum->value,
            'label' =>  $statusEnum->label()
        ];

        $status = mapEnumToArray(BlogStatus::class, $blog->status);

        $blog->load('products', 'products.skus');
        $products = Product::with('skus')->get();

        return view('Pages.Blog.Edit', compact('blog', 'status', 'sta', 'products'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(BlogRequest $request, Blog $blog)
    {
        try {

            $data = [
                'title' => $request->title,
                'short_description' => $request->short_description,
                'description' => $request->description,
                'status' => $request->status,
                'admin_id' => auth()->id() ?? 1,
            ];

            if (isset($request->slug) && !empty($request->slug)) {
                $data['slug'] = $request->slug;
            } else {
                $data['slug'] = Str::slug($request->title);
            }

            $path = null;

            if ($request->hasFile('image_url')) {
                if (!empty($blog->image_url) && Str::contains($blog->image_url, 'storage')) {
                    $oldPath = str_replace('storage/', '', $blog->image_url);
                    Storage::disk('public')->delete($oldPath);
                }

                $path = $request->file('image_url')->store('blog_images', 'public');
                $data['image_url'] = '/storage/' . $path;
            }

            $blog->update($data);

            if (isset($request->products)) {
                $currentProductIds = BlogProduct::where('blog_id', $blog->id)->pluck('product_id')->toArray();
            
                if (!empty(array_diff($request->products, $currentProductIds)) || !empty(array_diff($currentProductIds, $request->products))) {
                    
                    BlogProduct::where('blog_id', $blog->id)->whereNotIn('product_id', $request->products)->delete();
            
                    $newProducts = array_diff($request->products, $currentProductIds);
                    $insertData = [];
                    
                    foreach ($newProducts as $productId) {
                        $insertData[] = [
                            'blog_id' => $blog->id,
                            'product_id' => $productId,
                        ];
                    }
            
                    if (!empty($insertData)) {
                        BlogProduct::insert($insertData);
                    }
                }
            }
            

            return redirect()->back()->with('success', 'Cập nhật bài viết thành công');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Blog $blog)
    {
        try {

            deleteImage($blog->image_url);

            $blog->delete();

            if ($request->ajax()) {
                return response()->json(['type' => 'success', 'redirect' => route('admin.blog.index')]);
            }

            return redirect()->route('admin.blog.index')->with('success', 'Xóa blog thành công');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

}
