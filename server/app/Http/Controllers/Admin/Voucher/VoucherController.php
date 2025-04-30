<?php

namespace App\Http\Controllers\Admin\Voucher;

use App\DataTables\Voucher\VoucherDataTable;
use App\Enums\Voucher\VoucherStatus;
use App\Enums\Voucher\VoucherType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Voucher\VoucherRequest;
use App\Models\Voucher;
use Illuminate\Http\Request;

class VoucherController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(VoucherDataTable $dataTable)
    {
        return $dataTable->render('Pages.Voucher.Index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $status = VoucherStatus::getKeyValuePairs();
        $type = VoucherType::getKeyValuePairs();
        return view('Pages.Voucher.Create', compact('status', 'type'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(VoucherRequest $request)
    {
        try {
            $data = $request->all();
            $data['admin_id'] = auth()->id();
            $voucher = Voucher::create($data);

            if (isset($voucher)) return redirect()->route('admin.voucher.index')->with('success', 'Bạn đã thêm voucher thành công');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getmessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Voucher $voucher)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Voucher $voucher)
    {
        $statusEnum = VoucherStatus::fromValue(enumValue: $voucher->status);
        $sta = [
            'value' => $statusEnum->value,
            'label' =>  $statusEnum->label()
        ];

        $status = mapEnumToArray(VoucherStatus::class, $voucher->status);

        $typeEnum = VoucherType::fromValue(enumValue: $voucher->type);
        $ty = [
            'value' => $typeEnum->value,
            'label' =>  $typeEnum->label()
        ];

        $type = mapEnumToArray(VoucherType::class, $voucher->type);

        $checkTypePercent = $voucher->type === VoucherType::Percent;
        return view(
            'Pages.Voucher.Edit',
            compact(
                'voucher',
                'checkTypePercent',
                'status',
                'sta',
                'type',
                'ty',

            )
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Voucher $voucher)
    {
        try {
            $data = $request->all();
            $data['admin_id'] = auth()->id();
            $voucherNew = $voucher->update($data);

            if (isset($voucherNew)) return redirect()->back()->with('success', 'Bạn đã cập nhật voucher thành công');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getmessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Voucher $voucher)
    {
        try {
            $voucher->delete();
            if ($request->ajax()) {
                return response()->json(['type' => 'success', 'redirect' => route('admin.voucher.index')]);
            }
            return redirect()->route('admin.voucher.index')->with('success', 'Xóa voucher thành công');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
