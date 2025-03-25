<?php

namespace App\Http\Controllers\Admin\Setting;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    /**
     * Fetch a specific setting by its name, and decode if necessary.
     */
    protected function getSettingByKey($key)
    {
        $rawSettings = Setting::pluck('value', 'name');
        
        $settingValue = $rawSettings->get($key);

        return $settingValue ? (isJson($settingValue) ? json_decode($settingValue, true) : $settingValue) : null;
    }

    public function index()
    {
        // Example: Get a specific setting by key
        $imageActionSignUpHome = $this->getSettingByKey('imageActionSignUpHome');
        $announcementBar = $this->getSettingByKey('AnnouncementBar');

        // Pass these settings to your view
        return view('Pages.Setting.Index', compact('imageActionSignUpHome', 'announcementBar'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // dd($request);
        try {
            $validated = $request->validate([
                'supports' => 'array',
                'supports.*.title' => 'nullable|string|max:255',
                'supports.*.description' => 'nullable|string|max:255',
                'AnnouncementBar' => 'nullable|string|max:255',
            ]);

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

    /**
     * Handle logo-specific settings.
     */
    public function logo()
    {
        $logoHeaderLightMode = $this->getSettingByKey('logoHeaderLightMode');
        $logoHeaderDarkMode = $this->getSettingByKey('logoHeaderDarkMode');
        $logoFooterLightMode = $this->getSettingByKey('logoFooterLightMode');
        $logoFooterDarkMode = $this->getSettingByKey('logoFooterDarkMode');
        return view('Pages.Setting.Logo', compact('logoHeaderLightMode', 'logoHeaderDarkMode', 'logoFooterLightMode', 'logoFooterDarkMode'));
    }

    /**
     * Handle footer-specific settings.
     */
    public function footer()
    {
        $footer = Setting::where('name', 'footer')->first();
        return view('Pages.Setting.Footer', compact('footer'));
    }
}
