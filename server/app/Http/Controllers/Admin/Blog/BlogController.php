<?php

namespace App\Http\Controllers\Admin\Blog;

use App\DataTables\Blog\BlogDataTable;
use App\Enums\Blog\BlogStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Blog\BlogRequest;
use App\Models\Blog;
use App\Models\BlogTag;
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
    public function create()
    {
        $status = BlogStatus::getKeyValuePairs();
        $tags = Tag::all();
        return view('Pages.Blog.Create', ['status' => $status, 'tags' => $tags]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(BlogRequest $request)
    {
        // dd($request);
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

            // $path = null;

            if ($request->hasFile('image_url')) {
                // $path = Storage::disk('public')->put('blog_images', $request->image_url);
                $data['image_url'] = putImage('blog_images', $request->image_url);
            } else {
                $data['image_url'] = config('settings.image_default');
            }

            // dd($data['image_url']);
            
            $blog = Blog::create($data);
            
            // dd($blog->image_url);
            if (isset($request->tags) && !empty($request->tags)) {
                foreach ($request->tags as $tag) {
                    BlogTag::create(['blog_id' => $blog->id, 'tag_id' => $tag]);
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
        return view('Pages.Blog.Edit', ['blog' => $blog, 'status' => $status, 'sta' => $sta]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(BlogRequest $request, Blog $blog)
    {
        try {

            $dataCheck = ['title', 'short_description', 'description', 'slug', 'status', 'image_url'];
            $check = checkDataUpdate($request->only($dataCheck), $blog->only($dataCheck));

            if ($check) {
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


            return redirect()->route('admin.blog.index')->with('success', 'Thêm bài viết thành công');
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
