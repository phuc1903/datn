<?php

namespace App\Http\Controllers\Api\v1\ComboFeedback;

use App\Enums\Combo\ComboCommentStatus;
use App\Enums\Combo\ComboCommentUserStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Combo\CreateCommentRequest;
use App\Models\ComboComment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ComboCommentController extends Controller
{
    public function create(CreateCommentRequest $request)
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

            $combo_comment = ComboComment::create([
                'combo_id' => $request->combo_id,
                'user_id' => $userId,
                'parents_id' => $request->parents_id,
                'comment' => $request->comment,
                'status' => ComboCommentStatus::Active,
                'anonymous' => $request->anonymous ? ComboCommentUserStatus::Enable : ComboCommentUserStatus::Disable,
            ]);

            DB::commit();
            return ResponseSuccess('Created comment successfully', $combo_comment, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return ResponseError($e->getMessage(), null, 500);
        }
    }

    public function delete($id)
    {
        try {
            DB::beginTransaction();

            $comment = ComboComment::find($id);
            if (!$comment) {
                return ResponseError('Comment not found', null, 404);
            }

            $user = Auth::user();

            if ($user->id !== $comment->user_id) {
                return ResponseError('Unauthorized', null, 403);
            }

            // Xoá phản hồi con
            ComboComment::where('parents_id', $comment->id)->delete();

            // Xoá bình luận chính
            $comment->delete();

            DB::commit();
            return ResponseSuccess('Comment deleted successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return ResponseError($e->getMessage(), null, 500);
        }
    }

    public function getComboComments($comboId)
    {
        $comments = ComboComment::with([
            'user',
            'admin'
        ])->where('combo_id', $comboId)->get();

        return ResponseSuccess('Get comments successfully', $comments);
    }
}
