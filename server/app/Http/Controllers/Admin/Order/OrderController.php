<?php

namespace App\Http\Controllers\Admin\Order;

use App\DataTables\Order\OrderDataTable;
use App\Enums\Order\OrderPaymentMethod;
use App\Enums\Order\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(OrderDataTable $dataTables)
    {
        return $dataTables->render('Pages.Order.Index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

        $users = User::all();
        $products = Product::with('skus', 'skus.variantValues.variant', 'skus.variantValues.variant')->paginate(7);

        // dd($products);

        $status = collect(OrderStatus::getValues())
            ->map(fn($value) => [
                'label' => OrderStatus::fromValue($value)->label(),
                'value' => $value,
            ])
            ->values()
            ->toArray();
        $paymentMethod = collect(OrderPaymentMethod::getValues())
            ->map(fn($value) => [
                'label' => OrderPaymentMethod::fromValue($value)->label(),
                'value' => $value,
            ])
            ->values()
            ->toArray();

        return view('Pages.Order.Create', ['users' => $users, 'status' => $status, 'paymentMethod' => $paymentMethod, 'products' => $products]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
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
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, order $order)
    {
        // $paymentMethod = OrderPaymentMethod::fromValue($request->payment_method) ?? OrderPaymentMethod::fromLabel($request->payment_method);;
        $status = OrderStatus::fromValue($request->status) ?? OrderStatus::fromLabel($request->status);

        $order->update([
            // "reason" => $request->reason,
            // "full_name" => $request->full_name,
            // "email" => $request->email,
            // "phone_number" => $request->phone_number,
            // "address" => $request->address,
            "status" => $status,
            // "payment_method" => $paymentMethod,
        ]);

        return redirect()->back()->with('success', 'Cập nhật trạng thái thành công');
    }

    public function destroyProductItem(OrderItem $orderItem)
    {
        dd('Xóa sản phẩm');
        // $orderItem->delete();

        // return redirect()->back()->with('success', 'Xóa sản phẩm thành công');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(order $order)
    {
        try {
            $order->delete();
            return redirect()->route('admin.order.index')->with('success', 'Xóa đơn hàng thành công');
        }catch(\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
        // return redirect()->route('admin.order.index')->with('info', 'Không thể xóa đơn hàng');
    }
}
