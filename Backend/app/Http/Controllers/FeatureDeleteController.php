<?php

namespace App\Http\Controllers;

use App\Models\History_search;
use App\Models\ProductCompare;
use App\Models\UserCompare;
use App\Models\UserHeart;
use Illuminate\Http\Request;
use App\Http\Controllers\FeatureGetDataController;
use App\Models\CouponUser;
use App\Models\OrderCart;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class FeatureDeleteController extends Controller
{
    //
    public function deleteHistory($idDelete)
    {

        if ($idDelete) {
            History_search::where("History_search_id", $idDelete)->where("user_id", 1)->delete();

            $getHistory = History_search::orderBy("created_at", "desc")->limit(5)->get();
            return response()->json($getHistory);
        } else {
            return response()->json([], 500);
        }
    }

    public function deleteCompareId(Request $request)
    {
        $compareId = $request->input("productId") ?? null;
        $userId =  $request->input("userId") ?? null;


        if ($compareId !== null && $userId !== null) {
            ProductCompare::where("user_id", $userId)->where("product_id", $compareId)->delete();

            $getCompare = ProductCompare::select("product_compares.*", "products.*")
                ->Join("products", "product_compares.product_id", "=", "products.product_id")
                ->where("product_compares.user_id", $userId)
                ->limit(3)->get();

            if ($getCompare->count() > 0) {
                return response()->json($getCompare);
            }
        } else {
            return response()->json(["error" => "lỗi data gửi đến"], 400);
        }

        return response()->json([], 500);
    }
    public function deleteCompareAll($userId)
    {
        if (isset($userId)) {
            ProductCompare::where("user_id", $userId)->delete();
            return response()->json([], 200);
        }
        return response()->json([], 500);
    }

    public function couponDelete(Request $request)
    {
        $coupon_id = $request->input("coupon_user_id");
        $userId = Auth::id();

        if (!$userId || !$coupon_id) {
            return response()->json([
                "message_delete" => "Lỗi server vui lòng tải lại trang"
            ], 422);
        }


        $checkExists = CouponUser::where("user_id", $userId)
            ->where("coupon_user_id", $coupon_id)->exists();

        if (!$checkExists) {
            return response()->json([
                "message_delete" => "Mã giảm giá không tồn tại, refresh trang"
            ], 409);
        }

        $check =  CouponUser::where("user_id", $userId)
            ->where("coupon_user_id", $coupon_id)->delete();

        if (!$check) {
            return response()->json([
                "message_delete" => "Xóa không thành công"
            ], 410);
        }

        $function = new FeatureGetDataController();
        $result = $function->getListCoupon($userId);

        if ($result) {
            return response()->json($result);
        }

        return response()->json([], 500);
    }

    public function heartDelete(Request $request)
    {
        $productId = $request->input("productId");
        $userId = Auth::id();

        if (!$productId || !$userId) {
            return response()->json([
                "message_delete" => "Lỗi server vui lòng tải lại trang"
            ], 422);
        }


        $checkExists = UserHeart::where("user_id", $userId)
            ->where("product_id", $productId)->exists();

        if (!$checkExists) {
            return response()->json([
                "message_delete" => "Sản phẩm này không tồn tại"
            ], 409);
        }

        $check =  UserHeart::where("user_id", $userId)
            ->where("product_id", $productId)->delete();

        if (!$check) {
            return response()->json([
                "message_delete" => "xóa không thành công"
            ], 410);
        }

        $function = new FeatureGetDataController();
        $result = $function->getListHeart($userId);

        if ($result) {
            return response()->json($result);
        }

        return response()->json([], 500);
    }

    public function cartItemDelete(Request $request)
    {
        $productId = $request->input('productId');
        $userId = Auth::id();

        if (!$productId || !$userId) {
            return response()->json([
                "message_delete" => "Lỗi server vui lòng tải lại trang"
            ], 422);
        }


        $checkExists = OrderCart::where("user_id", $userId)
            ->where("product_id", $productId)->exists();

        if (!$checkExists) {
            return response()->json([
                "message_delete" => "Sản phẩm này không tồn tại trong giỏ hàng, tải lại trang"
            ], 409);
        }

        $check =  OrderCart::where("user_id", $userId)
            ->where("product_id", $productId)
            ->delete();

        if (!$check) {
            return response()->json([
                "message_delete" => "Xóa không thành công"
            ], 410);
        } else {
            return response()->json([
                "success" => "success",
                "message_success" => "Xóa thành công sản phẩm"
            ], 200);
        }


        // $function = new FeatureGetDataController();
        // $result = $function->Carts();

        // if ($result) {
        //     return response()->json($result);
        // }

        return response()->json([], 500);
    }
}