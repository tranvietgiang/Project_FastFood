<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use App\Models\CouponUser;
use App\Models\Product;
use App\Models\ProductCompare;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FeatureAddController extends Controller
{

    public function AddCompareId($compareId)
    {
        $getProduct = Product::where("product_id", $compareId)->first();

        if (!$getProduct) {
            return response()->json(["message" => "Sản phẩm không tồn tại"], 500);
        }

        $productCateId = $getProduct->cate_id;

        $existingCompare = ProductCompare::where("user_id", 1)->get();

        if ($existingCompare->count() > 0) {
            $firstCompareProduct = Product::where("product_id", $existingCompare->first()->product_id)->first();

            if ($firstCompareProduct && $firstCompareProduct->cate_id !== $productCateId) {
                return response()->json([], 500);
            }
        }

        ProductCompare::updateOrCreate(
            [
                "product_id" => $compareId,
                "user_id" => 1
            ],
            [
                "updated_at" => now()
            ]
        );


        $getCompare = ProductCompare::select("product_compares.*", "products.*")
            ->Join("products", "product_compares.product_id", "=", "products.product_id")->limit(4)->get();

        if ($getCompare) {

            return response()->json($getCompare);
        }

        return response()->json([], 500);
    }

    public function insertCouponUser(Request $request, $copiedId)
    {
        // $copiedId = $request->all();
        if (!$copiedId) {
            return response()->json(["message" => "Lỗi hệ thống"], 400);
        }

        $getCoupon = Coupon::where("coupon_id", $copiedId)->first();

        if ($getCoupon) {

            CouponUser::create([
                'coupon_user_id' => $getCoupon->coupon_id,
                'coupon_user_name' => $getCoupon->coupon_name,
                "coupon_user_percent" => $getCoupon->coupon_percent,
                "coupon_user_minimum_price" => $getCoupon->coupon_minimum_price,
                "user_id" => Auth::id()
            ]);

            if (!$copiedId) {
                return response()->json(["message" => "Lỗi hệ thống"], 400);
            }

            $getCoupon = Coupon::where("coupon_id", $copiedId)->first();

            if ($getCoupon) {
                CouponUser::create([
                    'coupon_user_id' => $getCoupon->coupon_id,
                    'coupon_user_name' => $getCoupon->coupon_name,
                    "coupon_user_percent" => $getCoupon->coupon_percent,
                    "coupon_user_minimum_price" => $getCoupon->coupon_minimum_price,
                    "user_id" => Auth::id(),
                ]);

                return response()->json([], 200);
            } else {
                return response()->json(["message" => "Mã Coupon này không tồn tại"], 400);
            }
        }
    }
}