<?php

namespace App\Http\Controllers\Api\V1\Address;

use App\Http\Controllers\Controller;
use App\Models\Province;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    public function index()
    {
        try {
            // Lấy danh sách tỉnh/thành phố
            $provinces = Province::with(['districts.wards'])->get();

            return ResponseSuccess('Danh sách tỉnh/thành phố', $provinces);
        } catch (\Exception $e) {
            return ResponseError($e->getMessage(), null, 500);
        }
    }
}
