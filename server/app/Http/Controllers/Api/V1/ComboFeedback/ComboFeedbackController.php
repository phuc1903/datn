<?php

namespace App\Http\Controllers\Api\V1\ComboFeedback;

use App\Enums\Order\OrderItemStatus;
use App\Enums\Order\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ComboFeedback;
use App\Models\Combo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ComboFeedbackController extends Controller
{
    public function create(Request $request)
    {
        try {
            DB::beginTransaction();

            $combo = Combo::find($request->combo_id);
            if (!$combo) {
                return ResponseError('Combo is not found', null, 404);
            }

            $userId = auth()->id();

            $orderStatusCheck = Order::where('id', $request->order_id)
                ->where('user_id', $userId)
                ->where('status', OrderStatus::Success())
                ->exists();

            if (!$orderStatusCheck) return ResponseError('The Order not successfully ', 400);

            $orderUserCheck = Order::where('id', $request->order_id)
                ->where('user_id', $userId)
                ->exists();

            if (!$orderUserCheck) return ResponseError('User does not own this order', 400);

            $orderCheck = Order::where('id', $request->order_id)->exists();
            if (!$orderCheck) return ResponseError('The Order not found ', 400);

            $orderItem = OrderItem::where('order_id', $request->order_id)
                ->where('combo_id', $request->combo_id)
                ->first();

            if ($orderItem) {
                $orderItem->update(['status' => OrderItemStatus::Success()]);
            }

            $comboFeedback = ComboFeedback::firstOrCreate([
                'combo_id' => $request->combo_id,
                'user_id' => $userId,
                'order_id' => $request->order_id,
                'rating' => $request->rating,
                'comment' => $request->comment,
            ]);

            if (!$comboFeedback->wasRecentlyCreated) {
                return ResponseError('This Combo has already been feedbacked', $comboFeedback, 400);
            }

            DB::commit();
            return ResponseSuccess('Created feedback successfully', $comboFeedback, 201);
        } catch (\Exception $e) {
            DB::rollBack();
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

            $feedback = ComboFeedback::find($id);
            if (!$feedback) {
                return ResponseError('Feedback not found', null, 404);
            }

            $feedback->update([
                'rating' => $request->rating,
                'comment' => $request->comment,
            ]);

            $feedback = ComboFeedback::with('combo')->find($id);

            return ResponseSuccess('Update feedback successfully', $feedback, 200);
        } catch (\Exception $exception) {
            return ResponseError($exception->getMessage(), null, 500);
        }
    }

    public function destroy($id)
    {
        try {
            $feedback = ComboFeedback::find($id);
            if (!$feedback) {
                return ResponseError('Comment not found', null, 404);
            }

            $user = Auth::user();
            if ($user->id !== $feedback->user_id) {
                return ResponseError('Unauthorized', null, 403);
            }

            $feedback->delete();
            return ResponseSuccess('Feedback deleted successfully');
        } catch (\Exception $e) {
            return ResponseError($e->getMessage(), null, 500);
        }
    }
}
