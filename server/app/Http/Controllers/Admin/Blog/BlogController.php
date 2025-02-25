<?php

namespace App\Http\Controllers\Admin\Blog;

use App\DataTables\Blog\BlogDataTable;
use App\Enums\Blog\BlogStatus;
use App\Http\Controllers\Controller;
use App\Models\Blog;
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
    public function create()
    {
        $status = BlogStatus::getKeyValuePairs();
        return view('Pages.Blog.Create', ['status' => $status]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
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
                $data['slug'] = Str::slug($request->name);
            }

            $path = null;

            if ($request->hasFile('image_url')) {
                $path = Storage::disk('public')->put('blog_images', $request->image_url);
                $data['image_url'] = '/storage/' . $path;
            } else {
                $data['image_url'] = config(key: 'settings.image_default');
            }

            Blog::create($data);
            

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
        $statusEnum = BlogStatus::fromValue( $blog->status);
        $sta = [
            'value' => $statusEnum->value,
            'label' =>  $statusEnum->label()
        ];

        $status = mapEnumToArray(BlogStatus::class, $blog->status);
        return view('Pages.Blog.Edit', ['blog' => $blog, 'status' => $status, 'sta' => $sta]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Blog $blog)
    {
        try {

            $dataCheck = ['title', 'short_description', 'description', 'slug', 'status'];
            $check = checkDataUpdate($request->only($dataCheck), $blog->only($dataCheck));

            if($check) {
                return redirect()->back()->with('info', 'Có vẻ dữ liệu không thay đổi');
            }
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
                $data['slug'] = Str::slug($request->name);
            }

            $path = null;

            if ($request->hasFile('image_url')) {
                $path = Storage::disk('public')->put('blog_images', $request->image_url);
                $data['image_url'] = '/storage/' . $path;
            } else {
                $data['image_url'] = config(key: 'settings.image_default');
            }

            Blog::create($data);
            

            return redirect()->route('admin.blog.index')->with('success', 'Thêm bài viết thành công');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Blog $blog)
    {
        try {

            if (Str::contains($blog->image_url, 'storage')) {
                $path = str_replace('storage/', '', $blog->image_url);
                Storage::disk('public')->delete($path);
            }

            $blog->delete();

            return redirect()->route('admin.slider.index')->with('success', 'Xóa slider thành công');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
