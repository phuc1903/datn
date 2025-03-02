<?php

namespace App\Http\Controllers\Admin\Slider;

use App\DataTables\Slider\SliderDataTable;
use App\Enums\Slide\SlideStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Slider\SliderRequest;
use App\Models\slider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SliderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(SliderDataTable $dataTables)
    {
        return $dataTables->render('Pages.Slider.Index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $status = SlideStatus::getKeyValuePairs();
        return view('Pages.Slider.Create', ['status' => $status]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SliderRequest $request)
    {
        try {
            $data = $request->all();

            $priority = $request->input('priority');

            if ($priority) {
                Slider::where('priority', '>=', $priority)->increment('priority');
            } else {
                $data['priority'] = Slider::max('priority') + 1;
            }

            if ($request->hasFile('image_url')) {
                $data['image_url'] = putImage('slider_image', $request->image_url);
            } else {
                $data['image_url'] = config(key: 'settings.image_default');
            }

            Slider::create($data);

            return redirect()->route('admin.slider.index')->with('success', 'Thêm slide thành công');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(slider $slider)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(slider $slider)
    {
        $statusEnum = SlideStatus::fromValue(enumValue: $slider->status);
        $sta = [
            'value' => $statusEnum->value,
            'label' =>  $statusEnum->label()
        ];

        $status = mapEnumToArray(SlideStatus::class, $slider->status);
        return view('Pages.Slider.Edit', ['slider' => $slider, 'status' => $status, 'sta' => $sta]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(SliderRequest $request, slider $slider)
    {
        try {
            $check = empty(array_diff_assoc(
                $request->only(['name', 'priority', 'image_url', 'status']),
                $slider->only(['name', 'priority', 'image_url', 'status'])
            ));

            if ($check) {
                return redirect()->back()->with('info', 'Có vẻ dữ liệu không thay đổi');
            }
            $data = $request->all();

            $priority = $request->input('priority');

            if ($priority) {
                Slider::where('priority', '>=', $priority)->increment('priority');
            } else {
                $data['priority'] = Slider::max('priority') + 1;
            }

            $path = null;

            if ($request->hasFile('image_url')) {
                if (!empty($category->image) && Str::contains($slider->image, 'storage')) {
                    $oldPath = str_replace('storage/', '', $slider->image);
                    Storage::disk('public')->delete($oldPath);
                }

                $path = $request->file('image_url')->store('slider_images', 'public');
                $data['image_url'] = '/storage/' . $path;
            }

            $slider->update($data);

            return redirect()->back()->with('success', 'Cập nhật slide thành công');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, slider $slider)
    {
        try {

            deleteImage($slider->image_url);
            $slider->delete();

            if ($request->ajax()) {
                return response()->json(['type' => 'success', 'redirect' => route('admin.slider.index')]);
            }

            return redirect()->route('admin.slider.index')->with('success', 'Xóa slider thành công');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
