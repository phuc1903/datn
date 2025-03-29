<?php

namespace App\Http\Controllers\Api\V1\Voucher;

use App\Enums\Voucher\VoucherStatus;
use App\Http\Controllers\Controller;
use App\Models\UserVoucher;
use App\Models\Voucher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VoucherController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Lấy toàn bộ vouchers hoạt động
    | Path: api/v1/vouchers
    |--------------------------------------------------------------------------
    */
    public function getAllVouchers(Request $request)
    {
        try {
            $perPage = $request->query('per_page', 10);
            $vouchers = Voucher::
                where('status', VoucherStatus::Active)
                ->paginate($perPage);

            return ResponseSuccess('Get all vouchers', $vouchers, 200);
        } catch (\Exception $e) {
            return ResponseError($e->getMessage(), null, 500);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Lấy chi tiết vouchers hoạt động
    | Path: api/v1/vouchers
    |--------------------------------------------------------------------------
    */
    public function getDetailVouchers($voucherId)
    {
        try {
            $vouchers = Voucher::
                where('status', VoucherStatus::Active)
                ->find($voucherId);

            // Kiểm tra tồn tại
            if (!$vouchers) {
                return ResponseError('Voucher is not found', null, 404);
            }

            return ResponseSuccess('Get details vouchers', $vouchers, 200);
        } catch (\Exception $e) {
            return ResponseError($e->getMessage(), null, 500);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Nhận vouchers
    | Path: api/v1/vouchers/{voucher_id}/claim
    |--------------------------------------------------------------------------
    */
    public function claimVouchers($voucherId)
    {
        try {
            $voucher = Voucher::where('status', VoucherStatus::Active)
                ->find($voucherId);

            // Kiểm tra tồn tại
            if (!$voucher) {
                return ResponseError('Voucher is not found', null, 404);
            }

            // Kiểm tra số lượng voucher còn lại
            if ($voucher->quantity <= 0) {
                return ResponseError('Voucher is out of stock', null, 400);
            }

            // Lấy thời gian hiện tại
            $currentTime = now(); // Trả về Carbon instance

            // Kiểm tra started_at (nếu có)
            if ($voucher->started_date && $currentTime->lt($voucher->started_date)) {
                return ResponseError('Voucher has not started yet', null, 400);
            }

            // Kiểm tra ended_at (nếu có)
            if ($voucher->ended_date && $currentTime->gt($voucher->ended_date)) {
                return ResponseError('Voucher has expired', null, 400);
            }

            // Kiểm tra xem user đã nhận voucher này chưa
            $userVoucherExists = UserVoucher::where('user_id', Auth::id())
                ->where('voucher_id', $voucherId)
                ->exists();

            if ($userVoucherExists) {
                return ResponseError('You have already claimed this voucher', null, 409);
            }

            // Nhận voucher và ghi vào bảng user_voucher
            $userVoucher = UserVoucher::create([
                'user_id' => Auth::id(),
                'voucher_id' => $voucherId
            ]);

            // Giảm số lượng voucher (nếu quantity là giới hạn số lần nhận)
            $voucher->decrement('quantity');

            // Trả về thông tin chi tiết
            return ResponseSuccess('Voucher claimed successfully', [
                'voucher' => $voucher,
                'claimed' => $userVoucher,
            ], 200);
        } catch (\Exception $e) {
            return ResponseError($e->getMessage(), null, 500);
        }
    }
}
