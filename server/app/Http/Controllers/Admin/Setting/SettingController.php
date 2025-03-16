<?php

namespace App\Http\Controllers\Admin\Setting;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $setting = Setting::all();
        return view('Pages.Setting.Index', compact('setting'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $name = $request->name;
    
            $value = $request->value;
    
            if (!empty($value) && is_array($value)) {
                $value = json_encode($value);
            }

            if($request->hasFile('value') && $request->file('value')->isValid()) {

                $existingImage = Setting::where('name', $name)->first();
                if ($existingImage && !empty($existingImage->value)) {
                    deleteImage($existingImage->value)  ; 
                }

                $value = putImage('config_images', $request->file('value'));
            }
    
            Setting::updateOrCreate(
                ['name' => $name],
                ['value' => $value],
            );
            
            return redirect()->back()->with('success', 'Cập nhật thành công');
        }catch(\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function footer(){
        $footer = Setting::where('name', 'footer')->first();
        return view('Pages.Setting.Footer', compact('footer'));
    }
}
