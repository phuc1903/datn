<?php

namespace App\Http\Controllers\Admin\Order;

use App\DataTables\Order\OrderDataTable;
use App\Enums\Order\OrderPaymentMethod;
use App\Enums\Order\OrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Order\OrderRequest;
use App\Models\District;
use App\Models\order;
use App\Models\Province;
use App\Models\Ward;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(OrderDataTable $dataTables)
    {
        $provinces = Province::all();
        $districts = District::all();
        $wards = Ward::all();
        return $dataTables->render('Pages.Order.Index', compact('provinces', 'districts', 'wards'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

        return redirect()->back()->with('error', 'Bạn không thể tạo đơn hàng');

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        return redirect()->back()->with('error', 'Bạn không thể tạo đơn hàng');
    }

    /**
     * Display the specified resource.
     */
    public function show(order $order)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(order $order)
    {
        $orderShow = $order->load('user', 'items', 'items.sku', 'items.sku.product', 'items.sku.variantValues');
        // dd($orderShow);

        $orderStatus = OrderStatus::fromValue($orderShow->status);
        $orderPayment = OrderPaymentMethod::fromValue($orderShow->payment_method);
        $checkStastus = $order->status === OrderStatus::Cancel;

        // dd($orderStatus->value);

        $statusList = collect(OrderStatus::getValues())
            ->filter(fn($status) => $status !== $orderStatus->value)
            ->map(fn($value) => [
                'label' => OrderStatus::fromValue($value)->label(),
                'value' => $value,
            ])
            ->values()
            ->toArray();


        $paymentList = collect(OrderPaymentMethod::getValues())
            ->filter(fn($payment) => $payment !== $orderPayment->value)
            ->map(fn($value) => [
                'label' => OrderPaymentMethod::fromValue($value)->label(),
                'value' => $value,
            ])
            ->values()
            ->toArray();

        // dd($paymentList);

        return view('Pages.Order.Edit', [
            'order' => $orderShow,
            'statusList' => $statusList,
            'paymentList' => $paymentList,
            'statusActive' => $orderStatus->label(),
            'paymentActive' => $orderPayment->label(),
            'statusActiveValue' => $orderStatus->value,
            'paymentActiveValue' => $orderPayment->value,
            'checkStatus' => $checkStastus,
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(OrderRequest $request, Order $order)
    {
        $newStatus = OrderStatus::fromValue($request->status);

        if (!$newStatus) {
            return redirect()->back()->with('error', 'Trạng thái không hợp lệ.');
        }

        $currentStatus = OrderStatus::fromValue($order->status);

        if (!$currentStatus->canTransitionTo($newStatus)) {
            return redirect()->back()->with('error', 'Không thể chuyển trạng thái này.');
        }

        $order->update([
            "status" => $newStatus,
            "reason" => $request->reason
        ]);
        

        return redirect()->back()->with('success', 'Cập nhật trạng thái thành công.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(order $order)
    {
        return redirect()->back()->with('error', 'Bạn không được phép xóa đơn hàng');
    }
}
