<?php

namespace App\Http\Controllers\Api\V1\Slider;

use App\Http\Controllers\Controller;
use App\Models\Slider;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SliderController extends Controller
{
    private $slider;
    public function __construct(Slider $slider)
    {
        $this->slider=$slider;
    }
    /*
    |--------------------------------------------------------------------------
    | Lấy toàn bộ thông tin toàn bộ Slide
    | Path: api/v1/slider
    |--------------------------------------------------------------------------
    */
    public function index(): JsonResponse
    {
        try {
            $sliders = $this->slider->where('status','=','active')->select('name','image_url','priority')->get();

            if ($sliders) {
                return ResponseSuccess('Banner retrieved successfully.',$sliders);
            } else {
                return ResponseError('Dont have any Banner',null,404);
            }
        }
        catch (\Exception $e) {
            return  ResponseError($e->getMessage(),null,500);
        }

    }
}
