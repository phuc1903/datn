<?php

namespace App\Http\Controllers\Admin\Permission;

use App\DataTables\Permission\PermissionDataTable;
use App\Enums\Module\ModuleStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Permission\PermissionRequest;
use App\Models\Module;
use App\Models\Permission;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(PermissionDataTable $dataTable)
    {
        return $dataTable->render('Pages.Permission.Index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

        $modules = Module::where('status', ModuleStatus::Complete)->get();

        return view('Pages.Permission.Create', compact('modules'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PermissionRequest $request)
    {
        try {
            Permission::create([
                'title' => $request->title,
                'name' => $request->name,
                'guard_name' => $request->guard_name,
                'module_id' => $request->module_id
            ]);

            return redirect()->route('admin.permission.index')->with('success', 'Thêm quyền thành công');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(Permission $permission)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Permission $permission)
    {
        $permission->load('module');
        $modules = Module::where('id', '!=', $permission->module->id)->get();
        return view('Pages.Permission.Edit', compact('permission', 'modules'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PermissionRequest $request, Permission $permission)
    {
        try {
            $data = [
                'title' => $request->title,
                'name' => $request->name,
                'guard_name' => $request->guard_name,
                'module_id' => $request->module_id
            ];
    
            $permission->update($data);
    
            return redirect()->back()->with('success', 'Cập nhật quyền thành công');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Không thể cập nhật quyền: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Permission $permission, Request $request)
    {
        try {
            $permission->roles()->detach();

            $permission->delete();

            if ($request->ajax()) {
                return response()->json(['type' => 'success', 'redirect' => route('admin.permission.index')]);
            }

            return redirect()->route('admin.permission.index')->with('success', 'Xóa quyền thành công');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Không thể xóa quyền: ' . $e->getMessage());
        }
    }
}
