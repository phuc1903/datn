<?php

namespace App\Http\Controllers\Admin\Admin;

use App\DataTables\Admin\AdminDataTable;
use App\Enums\Admin\AdminSex;
use App\Enums\Admin\AdminStatus;
use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(AdminDataTable $dataTable)
    {
        return $dataTable->render('Pages.Admin.Index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $sexList = collect(AdminSex::getValues())
            ->map(fn($value) => [
                'label' => AdminSex::fromValue($value)->label(),
                'value' => $value,
            ])
            ->values()
            ->toArray();

        $status = AdminStatus::getKeyValuePairs();

        $roles = Role::all();

        return view('Pages.Admin.Create', compact('sexList', 'roles', 'status'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // dd($request);
        try {
            $sex = AdminSex::fromValue($request->sex);

            $admin = Admin::create([
                'first_name'   => $request->first_name,
                'last_name'    => $request->last_name,
                'phone_number' => $request->phone_number,
                'password' => Hash::make($request->password),
                'email'        => $request->email,
                'sex'          => $sex->value,
            ]);

            if ($request->has('roles')) {
                $admin->syncRoles($request->roles);
            }

            return redirect()->route('admin.admin.index')->with('success', 'Thêm thành viên thành công');
        } catch (\Exception $e) {

            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(admin $admin)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Admin $admin)
    {
        $adminShow = $admin->load('roles');
        $roleHas = $adminShow->roles;
        $roles = Role::all()->map(function($role) use($roleHas) {
            return (object)[
                'id' => $role->id,  
                'name' => $role->name,
                'title' => $role->title,
                'guard_name' => $role->guard_name,
                'checked' => $roleHas->contains('id', $role->id)
            ];
        });
        
        $orderStatus = AdminStatus::fromValue($adminShow->status);
        $adminSex = AdminSex::fromValue($adminShow->sex);

        $statusList = collect(AdminStatus::getValues())
            ->filter(fn($status) => $status !== $orderStatus->value)
            ->map(fn($value) => [
                'label' => AdminStatus::fromValue($value)->label(),
                'value' => $value,
            ])
            ->values()
            ->toArray();


        $sexList = collect(AdminSex::getValues())
            ->filter(fn($payment) => $payment !== $adminSex->value)
            ->map(fn($value) => [
                'label' => AdminSex::fromValue($value)->label(),
                'value' => $value,
            ])
            ->values()
            ->toArray();

        return view('Pages.Admin.Edit', [
            'admin' => $adminShow,
            'statusList' => $statusList,
            'sexList' => $sexList,
            'statusActive' => $orderStatus->label(),
            'statusActiveValue' => $orderStatus->value,
            'sexActive' => $adminSex->label(),
            'sexActiveValue' => $adminSex->value,
            'roles' => $roles,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Admin $admin)
    {
        // dd($request);
        try {
            $status = AdminStatus::fromValue($request->status) ?? AdminStatus::fromLabel($request->status);
            $sex = AdminSex::fromValue($request->sex) ?? AdminSex::fromLabel($request->sex);

            $admin->update([
                'status' => $status->value,
                'sex' => $sex->value,
            ]);

            $admin->syncRoles($request->roles ?? []);


            return redirect()->back()->with('success', 'Cập nhật thành viên thành công');
        } catch (\Exception $e) {

            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(admin $admin, Request $request)
    {
        try {

            $admin->delete();

            if ($request->ajax()) {
                return response()->json(['type' => 'success', 'redirect' => route('admin.blog.index')]);
            }

            return redirect()->route('admin.admin.index')->with('success', 'Xóa thành viên thành công');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
