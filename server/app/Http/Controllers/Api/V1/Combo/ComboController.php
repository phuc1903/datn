<?php

namespace App\Http\Controllers\Api\V1\Combo;

use App\Http\Controllers\Controller;
use App\Models\Combo;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ComboController extends Controller
{
    public function getCombo($id): JsonResponse
    {
        try {
            $combo = Combo::with([
                'skus' => function ($query) {
                    $query->with(['product', 'variantValues.variant']) // Load product và variants
                    ->withPivot('quantity'); // Lấy quantity từ bảng trung gian
                }
            ])
                ->withCount('feedbacks as total_feedbacks')
                ->withAvg('feedbacks as average_rating', 'rating')
                ->find($id);

            if (!$combo) {
                return ResponseError('Combo not found', null, 404);
            }

            return ResponseSuccess('Combo retrieved successfully.', $combo, 200);
        } catch (\Exception $e) {
            return ResponseError($e->getMessage(), null, 500);
        }
    }

    public function getAllCombo(): JsonResponse
    {
        try {
            $combos = Combo::with([
                'skus' => function ($query) {
                    $query->with(['product', 'variantValues.variant']) // Load product và variants
                    ->withPivot('quantity'); // Lấy quantity từ bảng trung gian
                }
            ])
                ->withCount('feedbacks as total_feedbacks')
                ->withAvg('feedbacks as average_rating', 'rating')
                ->get();

            if ($combos->isEmpty()) {
                return ResponseError('No Combos be found', null, 404);
            }

            return ResponseSuccess('Combo retrieved successfully.', $combos);
        }
        catch (\Exception $e) {
            return ResponseError($e->getMessage(), null, 500);
        }
    }
    public function nearlyStart()
    {
        try {
            $date = Carbon::now()->addDays(2)->toDateString();
            $combos = Combo::whereDate('date_start','>=', $date)
                ->orderBy('date_start')
                ->limit(10)
                ->withCount('feedbacks as total_feedbacks')
                ->withAvg('feedbacks as average_rating', 'rating')
                ->get();
            if ($combos->isEmpty()) {
                return ResponseError('No Combos be found', null, 404);
            }

            return ResponseSuccess('Combo retrieved successfully.', $combos);
        }
        catch (\Exception $e) {
            return ResponseError($e->getMessage(), null, 500);
        }
    }
    public function nearlyEnd()
    {
        try {
            $date = Carbon::now()->addDays(2)->toDateString();
            $combos = Combo::whereDate('date_end','<=', $date)
                ->orderBy('date_end')
                ->limit(10)
                ->withCount('feedbacks as total_feedbacks')
                ->withAvg('feedbacks as average_rating', 'rating')
                ->get();
            if ($combos->isEmpty()) {
                return ResponseError('No Combos be found', null, 404);
            }

            return ResponseSuccess('Combo retrieved successfully.', $combos);
        }
        catch (\Exception $e) {
            return ResponseError($e->getMessage(), null, 500);
        }
    }
}
