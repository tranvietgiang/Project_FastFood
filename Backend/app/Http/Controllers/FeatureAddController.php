<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use App\Models\CouponUser;
use App\Models\Product;
use App\Models\ProductCompare;
use App\Models\UserCompare;
use App\Models\UserHeart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\OrderCart;

class FeatureAddController extends Controller
{

    public function AddCompareId(Request $request)
    {
        $productId = $request->input("productId") ?? null;
        $userId = $request->input("userId") ?? null;

        $getProduct = Product::where("product_id", $productId)->first();

        if (!$getProduct) {
            return response()->json(["message" => "Sản phẩm không tồn tại"], 500);
        }

        $productCateId = $getProduct->cate_id;

        $existingCompare = ProductCompare::where("user_id", $userId)->get();

        if ($existingCompare->count() > 0) {
            $firstCompareProduct = Product::where("product_id", $existingCompare->first()->product_id)->first();

            if ($firstCompareProduct && $firstCompareProduct->cate_id !== $productCateId) {
                return response()->json(["error" => "không trùng sản phẩm"], 500);
            }
        }

        ProductCompare::updateOrCreate(
            [
                "product_id" => $productId,
                "user_id" => $userId
            ],
            [
                "updated_at" => now()
            ]
        );

        $getCompare = ProductCompare::select("product_compares.*", "products.*")
            ->Join("products", "product_compares.product_id", "=", "products.product_id")
            ->where("product_compares.user_id", $userId)
            ->limit(3)->get();

        if ($getCompare) {
            return response()->json($getCompare);
        }


        return response()->json([], 500);
    }


    public function insertCouponUser(Request $request, $copiedId)
    {
        $displayDate = $request->input("displayDate") ?? null;
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
                "created_at" => $displayDate
                // "updated_at" => substr($getCoupon->getRawOriginal("updated_at"), 0, 10),
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

    public function insertHeartUser(Request $request)
    {
        $productId = $request->input("selectId") ?? null;
        $userId = $request->input("user_id") ?? null;

        if (!$productId && !$userId) {
            return response()->json([], 400);
        }


        if (UserHeart::where("product_id", $productId)->where("user_id", $userId)->exists()) {
            return response()->json(
                ["message_error" => "Sản phẩm này đã được thêm"],
                409
            );
        }

        $check = UserHeart::create([
            "product_id" => $productId,
            "user_id" => $userId
        ]);

        if ($check) {
            $heartList = UserHeart::orderBy("created_at", "desc")->get();
            if ($heartList->count() > 0) {
                return response()->json($heartList);
            }
        }

        return response()->json([], 500);
    }


    public function insertCartItem(Request $request)
    {
        $productId = $request->input('productId');
        $priceDiscount = $request->input('priceDiscount');

        $userId = Auth::id();

        if (!$userId) {
            return response()->json(['cartItem_error' => 'Unauthorized'], 402);
        }

        if (!$productId) {
            return response()->json(['cartItem_error' => 'Lỗi dữ liệu, vui lòng refresh trang'], 402);
        }

        $checkItem = Product::where("product_id", $productId)->first();
        if (!$checkItem) {
            return response()->json(['cartItem_error' => 'Không tìm thấy sản phẩm'], 402);
        }

        $checkCart = OrderCart::where("product_id", $productId)
            ->where("user_id", $userId)
            ->first();

        if ($checkCart) {
            return response()->json(['cartItem_error' => 'Sản phẩm đã tồn tại trong giỏ hàng'], 402);
        }

        if ($priceDiscount) {
            OrderCart::create([
                "product_id" => $productId,
                "user_id" => $userId,
                "cart_quantity" => 1,
                "current_price" => $priceDiscount
            ]);
        } else {
            OrderCart::create([
                "product_id" => $productId,
                "user_id" => $userId,
                "cart_quantity" => 1,
                "current_price" => $checkItem->product_price
            ]);
        }

        $count = OrderCart::where("user_id", Auth::id())->count();

        return response()->json(
            [
                'message' => 'Đã thêm vào giỏ hàng',
                "count_cart" => $count
            ],
            200
        );
    }
}