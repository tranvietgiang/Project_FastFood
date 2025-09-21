<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductCompare;
use App\Models\UserCompare;
use App\Models\UserHeart;
use Illuminate\Http\Request;

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
            ->paginate(8); // ✅ đúng cú pháp

        if ($getHeartProducts->count() > 0) {
            return response()->json($getHeartProducts);
        } else {
            return response()->json([]);
        }
        return response()->json([], 500);
    }
}