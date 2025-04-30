<?php

namespace App\Http\Controllers\Admin\Setting;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
   
    public function index()
    {
        $settings = Setting::all()->pluck('value', 'name')->map(function ($value) {
            if (is_string($value) && json_decode($value) !== null) {
                return json_decode($value, true);
            }
            return $value;
        });

        return view('Pages.Setting.Index', compact('settings'));
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            foreach ($request->except('_token') as $key => $value) {
                if ($request->hasFile($key)) {
                    $existingImage = Setting::where('name', $key)->first();
                    if ($existingImage && !empty($existingImage->value)) {
                        deleteImage($existingImage->value);
                    }
                    $value = putImage('config_images', $request->file($key));
                } elseif (is_array($value)) {
                    $value = json_encode($value);
                }

                Setting::updateOrCreate(
                    ['name' => $key],
                    ['value' => $value]
                );
            }
            return redirect()->back()->with('success', 'Cập nhật thành công');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

}
