<?php

namespace App\Http\Controllers;

use App\Models\CouponUser;
use App\Models\OrderCart;
use App\Models\Product;
use App\Models\ProductCompare;
use App\Models\User;
use App\Models\UserCompare;
use App\Models\UserHeart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Termwind\Components\Raw;

class FeatureGetDataController extends Controller
{
    //
    public function getCompare($userId)
    {
        $getCompareUser = ProductCompare::select("product_compares.*", "products.*")
            ->Join("products", "product_compares.product_id", "=", "products.product_id")
            ->where("product_compares.user_id", $userId)
            ->limit(3)->get();
        if ($getCompareUser->count() > 0) {
            return response()->json($getCompareUser);
        }

        return response()->json([], 500);
    }





    public function compareIngredients($userId)
    {
        $check = ProductCompare::where("user_id", $userId)->count();
        if ($check < 2) {
            return response()->json([], 410);
        }

        $getCompareIngredients =
            ProductCompare::select("product_compares.*", "products.*", "percents.percent_name")
            ->Join("products", "product_compares.product_id", "=", "products.product_id")
            ->leftJoin("percents", "products.product_id", "=", "percents.product_id")
            ->where("product_compares.user_id", $userId)
            ->orderBy("product_compares.created_at", "asc")
            ->limit(3)->get();

        // dd($getCompareIngredients);
        if ($getCompareIngredients->count() > 0) {
            return response()->json($getCompareIngredients);
        }
    }

    public function GestProductId($productId)
    {
        // Lấy sản phẩm được chọn
        $getProduct = Product::where("Product_id", $productId)->first();

        if (!$getProduct) {
            return response()->json(["message" => "Sản phẩm không tồn tại"], 404);
        }

        // Lấy các sản phẩm cùng category (trừ chính nó)
        $productUserCompare = Product::where("cate_id", $getProduct->category_id)
            ->where("product_id", "!=", $productId)
            ->orderBy("updated_at", "desc")
            ->get();

        return response()->json([
            "selectedProduct" => $getProduct,
            "compareProducts" => $productUserCompare
        ]);
    }

    public function GestProductList(Request $request)
    {
        // Nhận mảng productId từ request
        $ids = $request->input("ids", []);

        if (empty($ids)) {
            return response()->json([]);
        }

        // Lấy danh sách sản phẩm theo ids
        $products = Product::whereIn("product_id", $ids)
            ->orderBy("updated_at", "desc")
            ->get();

        return response()->json($products);
    }

    public function getListHeart($userId)
    {
        $getHeartProducts = UserHeart::select(
            "user_hearts.*",
            "products.*",
            "percents.percent_name",
        )
            ->join("products", "user_hearts.product_id", "=", "products.product_id")
            ->leftJoin("percents", "products.product_id", "=", "percents.product_id")
            ->where("user_hearts.user_id", $userId)
            ->orderBy("user_hearts.updated_at", "desc")
            ->paginate(8);

        if ($getHeartProducts) {
            return response()->json($getHeartProducts);
        } else {
            return response()->json([]);
        }
        return response()->json([], 500);
    }

    public function getListCoupon($userId)
    {
        if (!$userId) {
            return response()->json([
                "auth" => "user-login -yet"
            ], 421);
        }

        $getCouponProducts = CouponUser::where("coupon_users.user_id", $userId)
            ->orderBy("coupon_users.updated_at", "desc")
            ->paginate(8);

        if ($getCouponProducts->count() > 0) {
            return response()->json($getCouponProducts);
        } else {
            return response()->json([]);
        }
        return response()->json([], 500);
    }


    public function countCoupon()
    {
        $getListCoupon = CouponUser::where("user_id", Auth::id())
            ->orderBy("created_at", "desc")->count();

        if ($getListCoupon > 0) {
            return response()->json([
                "count" => $getListCoupon
            ]);
        }

        return response()->json([], 400);
    }

    public function getUser()
    {
        // Lấy tất cả user trừ user hiện tại
        $users = User::where('id', '!=', Auth::id())->get();
        return response()->json($users);
    }


    public function Carts()
    {
        $getData = OrderCart::select("products.*", "order_carts.*")
            ->join("products", "order_carts.product_id", "=", "products.product_id")
            ->where('order_carts.user_id', Auth::id())->get();

        if ($getData->count() > 0) {
            return response()->json(
                [
                    "get_data" => $getData,
                    "count_cart" => $getData->count()
                ]
            );
        }
        return response()->json([], 500);
    }
}
