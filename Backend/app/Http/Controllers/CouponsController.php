<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use Illuminate\Http\Request;

class CouponsController extends Controller
{
    //
    public function getCoupon()
    {
        $getCoupons = Coupon::orderBy("created_at", "desc")->limit(4)->get();
        if ($getCoupons->count() > 1) {

            return response()->json($getCoupons);
        }

        return response()->json(["message" => "error backend!"], 500);
    }
}