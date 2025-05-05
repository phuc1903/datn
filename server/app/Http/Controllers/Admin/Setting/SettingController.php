<?php

namespace App\Http\Controllers\Admin\Setting;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
   
    public function index()
    {
        $general = Setting::whereIn('name', [
            'imageActionSignUpHome',
            'supports',
            'AnnouncementBar',
            'NameWebsite',
            'imageIntroduceVoucher',
        ])->pluck('value', 'name')->toArray();

        if (isset($general['supports']) && is_string($general['supports'])) {
            $general['supports'] = json_decode($general['supports'], true);
        }

        return view('Pages.Setting.Index', ['settings' => $general]);
    }

    public function logo()
    {
        $logos = Setting::whereIn('name', [
                'logoHeaderLightMode',
                'logoHeaderDarkMode',
                'logoFooterLightMode',
                'logoFooterDarkMode',
                'IconSite',
            ])
            ->pluck('value', 'name')
            ->toArray();

        return view('Pages.Setting.Logo', compact('logos'));
    }

    public function footer()
    {
        $footer = Setting::whereIn('name', [
                'FooterHouseOpen',
                'FooterComplaints',
                'FooterSlogan',
                'FooterAddresses',
            ])
            ->pluck('value', 'name')
            ->toArray();

        return view('Pages.Setting.Footer', compact('footer'));
    }

    public function about()
    {
        $about = Setting::where('name', 'About')->value('value');

        return view('Pages.Setting.About', compact('about'));
    }

    public function contact()
    {
        $contact = Setting::where('name', 'Contact')->value('value');

        $contact = json_decode($contact, true); // Giải mã JSON thành mảng

        return view('Pages.Setting.Contact', compact('contact'));
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
