<?php

namespace App\Http\Controllers\Admin\Role;

use App\DataTables\Role\RoleDataTable;
use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(RoleDataTable  $dataTable)
    {
        return $dataTable->render('Pages.Role.Index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $modules = Module::with('permissions')->get();
        return view('Pages.Role.Create', compact('modules'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $role = Role::create([
                'title' => $request->title,
                'name' => $request->name,
                'guard_name' => 'admin',
            ]);

            $role->givePermissionTo($request->permissions);

            return redirect()->route('admin.role.index')->with('success', 'Thêm vai trò thành công');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Role $role)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $role)
    {
        $modules = Module::with('permissions')->get();
        $rolePermissions = $role->permissions->pluck('name')->toArray();

        return view('Pages.Role.Edit', compact('role', 'modules', 'rolePermissions'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Role $role)
    {
        try {
            $role->update([
                'title' => $request->title,
                'name' => $request->name,
                'guard_name' => $request->guard_name,
            ]);

            $role->syncPermissions($request->permissions);
            return redirect()->back()->with('success', 'Cập nhật vai trò thành cong');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Role $role)
    {
        try {

            $role->delete();

            if ($request->ajax()) {
                return response()->json(['type' => 'success', 'redirect' => route('admin.role.index')]);
            }

            return redirect()->route('admin.role.index')->with('success', 'Xóa vai trò thành công');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
