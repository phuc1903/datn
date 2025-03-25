<?php

namespace App\Http\Controllers\Admin\Product;

use App\DataTables\Product\FeedbackDataTable;
use App\Enums\Product\ProductFeedbackStatus;
use App\Http\Controllers\Controller;
use App\Models\ProductFeedback;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(FeedbackDataTable $dataTable)
    {
        return $dataTable->render('Pages.Product.Feedback.Index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $feedback = ProductFeedback::with('user', 'sku', 'sku.product', 'sku.variantValues', 'order')->find($id);

        $statusEnum = ProductFeedbackStatus::fromValue($feedback->status);
        $sta = [
            'value' => $statusEnum->value,
            'label' =>  $statusEnum->label()
        ];

        $status = mapEnumToArray(ProductFeedbackStatus::class, $feedback->status);
        return view('Pages.Product.Feedback.Edit', compact('feedback', 'status', 'sta'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            if($request->status === ProductFeedbackStatus::Pending) {
                return redirect()->back()->with('info', 'Bạn không thể đổi sang trạng thái này');
            }
            $productFeedback = ProductFeedback::findOrFail($id);
            $productFeedback->update([
                'status' => $request->status,
            ]);

            return redirect()->back()->with('success', 'Cập nhật trạng thái thành công');
        }catch(\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
