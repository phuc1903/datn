<?php

namespace App\Http\Controllers\Admin\Address;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Province;
use App\Models\District;
use App\Models\Ward;

class AddressController extends Controller
{
    public function getProvinces()
    {
        return response()->json([
            'data' => Province::select('code', 'name', 'administrative_unit_id')
                ->with('administrativeUnit:id,short_name')
                ->get()
                ->map(function ($province) {
                    return [
                        'code' => $province->code,
                        'name' => optional($province->administrativeUnit)->short_name.' '.$province->name
                    ];
                })
        ]);
    }


    public function getDistrictsByProvince(Request $request)
    {
        $provinceCode = $request->query('province_code');

        if (!$provinceCode) {
            return response()->json(['data' => []]);
        }

        return response()->json([
            'data' => District::where('province_code', $provinceCode)
                ->select('code', 'name', 'administrative_unit_id')
                ->with('administrativeUnit:id,short_name')
                ->get()
                ->map(function ($district) {
                    return [
                        'code' => $district->code,
                        'name' => optional($district->administrativeUnit)->short_name .' '.$district->name
                    ];
                })
        ]);
    }


    public function getWardsByDistrict(Request $request)
    {
        $districtCode = $request->query('district_code');

        if (!$districtCode) {
            return response()->json(['data' => []]);
        }

        return response()->json([
            'data' => Ward::where('district_code', $districtCode)
                ->select('code', 'name', 'administrative_unit_id')
                ->with('administrativeUnit:id,short_name')
                ->get()
                ->map(function ($ward) {
                    return [
                        'code' => $ward->code,
                        'name' => optional($ward->administrativeUnit)->short_name.' '.$ward->name
                    ];
                })
        ]);
    }
}
