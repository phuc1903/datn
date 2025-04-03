<?php

namespace App\Http\Controllers\Api\V1\ProductFeedback;

use App\Enums\Order\OrderItemStatus;
use App\Enums\Order\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductFeedback;
use App\Models\Sku;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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
            })->orderBy('created_at', 'desc')->get();
            return ResponseSuccess('Get data successfully',$orderItems,200);

        } catch (\Exception $e) {
            return ResponseError($e->getMessage(), null, 500);
        }
    }

    public function create(Request $request)
    {
        try {
            DB::beginTransaction();
            $sku = $request->sku_code
                ? Sku::where('sku_code', $request->sku_code)->first()
                : Sku::find($request->sku_id);
            // Kiểm tra tồn tại
            if (!$sku) {
                return ResponseError('Sku is not found', null, 404);
            }

            $orderStatusCheck = Order::where('id',$request->order_id)
                ->where('user_id',\auth()->id())
                ->where('status',OrderStatus::Success())->exists();
            $orderUserCheck = Order::where('id',$request->order_id)
                ->where('user_id',\auth()->id())
                ->exists();
            $orderCheck = Order::where('id',$request->order_id)
                ->exists();
            if (!$orderStatusCheck) return  ResponseError('The Order not successfully ',400);
            if (!$orderUserCheck)   return  ResponseError('User dont has this order ',400);
            if (!$orderCheck)       return  ResponseError('The Order not found ',400);


            $checkOrderItemStatus = OrderItem::where('order_id',$request->order_id)->where('sku_id',$request->sku_id);
            if($checkOrderItemStatus){
                $checkOrderItemStatus->update(['status'=>OrderItemStatus::Success()]);
            }

            $product_feedback = ProductFeedback::firstOrCreate([
                'sku_id'=>$request->sku_id,
                'user_id'=>\auth()->id(),
                'order_id'=>$request->order_id,
                'rating'=>$request->rating,
                'comment'=>$request->comment,
            ]);
            if(!$product_feedback->wasRecentlyCreated){
                return  ResponseError('This Product be Fedback',$product_feedback,400);
            }
            DB::commit();
            return ResponseSuccess('created Feedback successfully',$product_feedback,201);
        }
        catch (\Exception $e){
            return ResponseError($e->getMessage(), null, 500);
        }
    }

    public function update(Request $request, $id)
    {

        try {
            $user = auth()->user();
            if (!$user) {
                return ResponseError('Authentication failed', null, 400);
            }

            $feedback = ProductFeedback::find($id);
            if (!$feedback) {
                return ResponseError('Feedback not found', null, 404);
            }

            $feedback->update([
                'rating' => $request->rating,
                'comment' => $request->comment,
            ]);

            $feedback = ProductFeedback::with('sku.product')->find($id);

            return ResponseSuccess('Update feedback successfully', $feedback, 200);
        } catch (\Exception $exception) {
            return ResponseError($exception->getMessage(), null, 500);
        }
    }


    public function destroy($id)
    {
        try {
            // Lấy bình luận
            $feedback = ProductFeedback::find($id);
            if (!$feedback) {
                return ResponseError('Comment not found', null, 404);
            }

            $user = Auth::user();

            // Kiểm tra quyền xóa (user chỉ xóa được bình luận của mình)
            if ($user->id !== $feedback->user_id ) {
                return ResponseError('Unauthorized', null, 403);
            }
            $feedback->delete();
            return ResponseSuccess('Feedback deleted successfully');
        }
        catch (\Exception $e) {
        return ResponseError($e->getMessage(), null, 500);
    }
    }
}
