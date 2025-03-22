<?php

namespace App\Http\Controllers\Admin\Module;

use App\DataTables\Module\ModuleDataTable;
use App\Enums\Module\ModuleStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Module\ModuleRequest;
use App\Models\Module;
use Illuminate\Http\Request;

class ModuleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(ModuleDataTable $dataTable)
    {
        return $dataTable->render('Pages.Module.Index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $status = ModuleStatus::getKeyValuePairs();

        return view('Pages.Module.Create', compact('status'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ModuleRequest $request)
    {
        try {

            Module::create([
                'name' => $request->name,
                'description' => $request->description,
                'status' => $request->status,
            ]);

            return redirect()->route('admin.module.index')->with('success', 'Thêm Module thành công');

        }catch(\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Module $module)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Module $module)
    {
        $statusEnum = ModuleStatus::fromValue($module->status);
        $sta = [
            'value' => $statusEnum->value,
            'label' =>  $statusEnum->label()
        ];

        $status = mapEnumToArray(ModuleStatus::class, $module->status);

        return view('Pages.Module.Edit', compact('module', 'status', 'sta'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Module $module)
    {
        try {

            $module->update($request->all());

            return redirect()->back()->with('success', 'Cập nhật module thành công');

        }catch(\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Module $module, Request $request)
    {
        try {
            
            $module->delete();

            if ($request->ajax()) {
                return response()->json(['type' => 'success', 'redirect' => route('admin.module.index')]);
            }

            return redirect()->route('admin.module.index')->with('success', 'Xóa module thành công');
        }catch(\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
