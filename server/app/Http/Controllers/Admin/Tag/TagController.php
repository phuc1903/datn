<?php

namespace App\Http\Controllers\Admin\Tag;

use App\DataTables\Tag\TagDataTable;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Tag\TagRequest;
use App\Models\Tag;
use Illuminate\Http\Request;

class TagController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(TagDataTable $dataTable)
    {
        return $dataTable->render('Pages.Tag.Index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('Pages.Tag.Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TagRequest $request)
    {
        try {
            Tag::create($request->all());
            return redirect()->route('admin.tag.index')->with('success', 'Thêm danh mục bài viết thành công');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Tag $tag)
    {
        return view('Pages.Tag.Edit', compact('tag'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TagRequest $request, Tag $tag)
    {
        try {
            $check = checkDataUpdate($request->only(['name']), $tag->only(['name']));
            if ($check) return redirect()->back()->with('info', 'Có vẻ dẽ liệu không thay đổi');
            $tag->update($request->all());
            return redirect()->route('admin.tag.index')->with('success', 'Cập nhật danh mục bài viết thành công');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request,Tag $tag)
    {
        $tag->delete();
        if ($request->ajax()) {
            return response()->json(['type' => 'success', 'redirect' => route('admin.tag.index')]);
        }
        return redirect()->route('admin.user.index')->with('success', 'Xóa tài khoản khách hàng thành công');
    }
}
