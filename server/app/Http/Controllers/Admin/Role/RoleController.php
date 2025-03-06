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
        return view('Pages.Role.Create', ['modules' => $modules]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // dd($request);

        $role = Role::create([
            'title' => $request->title,
            'name' => $request->title,
            'guard_name' => $request->title,
            // 'guard_name' => $request->guard_name
        ]);

        foreach($request->permission as $item) {
            $role->givePermissionTo($item);
        }

        return redirect()->route('admin.role.index')->with('success', 'Thêm vai trò thành công');
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
        dd($role);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Role $role)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        //
    }
}
