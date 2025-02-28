<?php

namespace App\Http\Controllers\Api\V1\ProductFeedback;

use App\Enums\Order\OrderItemStatus;
use App\Http\Controllers\Controller;
use App\Models\OrderItem;
use App\Models\ProductFeedback;
use App\Models\Sku;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductFeedbackController extends Controller
{
    private $product_feedbacks ;
    public function __construct(ProductFeedback $product_feedbacks)
    {
        $this->product_feedbacks=$product_feedbacks;
    }
    public function getAllOrderItem()
    {
        try {
            $userId = Auth::id();

            if (!$userId) {
                return ResponseError('User not authenticated', null, 401);
            }
            $user = User::find($userId);
            if (!$user) {
                return ResponseError('User not found', null, 404);
            }
            $orderItems = OrderItem::whereHas('order', function ($query) use ($userId) {
                $query->where('user_id', $userId)->where('status', 'success');
            })->get();
            return ResponseSuccess('Get data successfully',$orderItems,200);

        } catch (\Exception $e) {
            return ResponseError($e->getMessage(), null, 500);
        }
    }

    public function create(Request $request)
    {
        try {
            $sku = $request->sku_code
                ? Sku::where('sku_code', $request->sku_code)->first()
                : Sku::find($request->sku_id);
            // Kiểm tra tồn tại
            if (!$sku) {
                return ResponseError('Sku is not found', null, 404);
            }
            $product_feedback = ProductFeedback::create([
                'sku_id'=>$request->sku_id,
                'user_id'=>\auth()->id(),
                'order_id'=>$request->order_id,
                'rating'=>$request->rating,
                'content'=>$request->content,
            ]);
            return ResponseSuccess('created Feedback successfully',$product_feedback,201);
        }
        catch (\Exception $e){
            return ResponseError($e->getMessage(), null, 500);
        }
    }
}
