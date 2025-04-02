<?php

namespace App\Http\Controllers\Api\V1\Setting;

use App\Http\Controllers\Controller;
use App\Models\Setting;

class SettingController extends Controller
{
    public function getAllSettings()
    {
        try {
            $setting = Setting::all();

            return ResponseSuccess('Setting retrieved successfully.', $setting, 200);
        } catch (\Exception $e) {
            return ResponseError($e->getMessage(), null, 500);
        }
    }
}
