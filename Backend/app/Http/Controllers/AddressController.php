<?php

namespace App\Http\Controllers;

use App\Models\AddressDistrict;
use App\Models\AddressProvince;
use App\Models\AddressUser;
use App\Models\AddressWards;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    //
    public function getProvince()
    {
        $getProvince = AddressProvince::orderBy("name", "asc")->get();
        if ($getProvince->count() > 0) {
            return response()->json($getProvince);
        }
        return response()->json([], 500);
    }

    public function getDistrict($provinceId)
    {
        if (!is_numeric($provinceId)) {
            return response()->json(['error' => 'Invalid province ID'], 400);
        }
        $getDistrict = AddressDistrict::where("province_id", $provinceId)->orderBy("name", "asc")->get();
        return response()->json($getDistrict, 200);
    }

    public function getWard($districtId)
    {
        $getWards = AddressWards::where("district_id", $districtId)->orderBy("name", "asc")->get();
        if ($getWards->count() > 0) {
            return response()->json($getWards);
        }
        return response()->json([], 500);
    }

    public function inertAddress(Request $request)
    {
        $data = $request->input("data");

        if (empty($data)) {
            return response()->json([], 400);
        }


        $CheckAddress = AddressUser::where("province_name", $data["getNameProvince"])
            ->where("province_name", $data["getNameProvince"])
            ->where("district_name", $data["getNameDistrict"])
            ->where("ward_name", $data["getNameWard"])
            ->exists();

        if ($CheckAddress) {
            return response()->json([
                "error" => "Địa chỉ này đã tồn tại"
            ], 400);
        }

        AddressUser::create([
            "province_name" => $data["getNameProvince"],
            "district_name" => $data["getNameDistrict"],
            "ward_name" => $data["getNameWard"],
            "user_id" => $data["user_id"],
            "address_detail" => $data["text"] ?? ""
        ]);



        $getAddress = AddressUser::orderBy("created_at", "desc")->get();

        if ($getAddress->count() > 0) {
            return response()->json($getAddress);
        }
        return response()->json([], 500);
    }
    public function getAddress()
    {
        $getAddress = AddressUser::orderBy("created_at", "desc")->get();

        if ($getAddress->count() > 0) {
            return response()->json($getAddress);
        }
        return response()->json([], 500);
    }
}