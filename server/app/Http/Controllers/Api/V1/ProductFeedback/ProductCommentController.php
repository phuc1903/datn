<?php

namespace App\Http\Controllers\Api\V1\ProductFeedback;

use App\Enums\Product\ProductCommentStatus;
use App\Enums\Product\ProductCommentUserStatus;
use App\Http\Controllers\Controller;
use App\Models\ProductComment;
use App\Models\ProductFeedback;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ProductCommentController extends Controller
{
    public function create(Request $request)
    {
        try {
            DB::beginTransaction();
            $userId = Auth::id();

            if (!$userId) {
                return ResponseError('User not authenticated', null, 401);
            }
            $user = User::find($userId);
            if (!$user) {
                return ResponseError('User not found', null, 404);
            }
            $product_comment = ProductComment::create([
                'product_id'=>$request->product_id,
                'user_id'=>$userId,
                'parents_id'=>$request->parents_id,
                'comment'=>$request->comment,
                'status'=> ProductCommentStatus::Active,
                'anonymous'=>$request->anonymous ? ProductCommentUserStatus::Enable : ProductCommentUserStatus::Disable,
            ]);

            DB::commit();
            return ResponseSuccess('created Comment successfully',$product_comment,201);
        }
        catch (\Exception $e){
            return ResponseError($e->getMessage(), null, 500);
        }
    }
    public function delete($id)
    {

        try {
            DB::beginTransaction();

            // Lấy bình luận
            $comment = ProductComment::find($id);
            if (!$comment) {
                return ResponseError('Comment not found', null, 404);
            }

            $user = Auth::user();

            // Kiểm tra quyền xóa (user chỉ xóa được bình luận của mình)
            if ($user->id !== $comment->user_id ) {
                return ResponseError('Unauthorized', null, 403);
            }

            // Xóa luôn phản hồi con (cascade delete)
            ProductComment::where('parents_id', $comment->id)->delete();

            // Xóa bình luận chính
            $comment->delete();

            DB::commit();
            return ResponseSuccess('Comment deleted successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return ResponseError($e->getMessage(), null, 500);
        }
    }

    public function getProductComments($productId)
    {
        $comments = ProductComment::where('product_id', $productId)
            ->get();

        return ResponseSuccess('get Comment successfully',$comments);
    }
}
