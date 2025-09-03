<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductCompare;
use Illuminate\Http\Request;

class FeatureAddController extends Controller
{
    //

    public function AddCompareId($compareId)
    {
        $getProduct = Product::where("product_id", $compareId)->first();

        if (!$getProduct) {
            return response()->json(["message" => "Sản phẩm không tồn tại"], 500);
        }

        // Lấy danh mục của sản phẩm cần thêm
        $productCateId = $getProduct->cate_id;

        // Kiểm tra các sản phẩm đã có trong bảng compare của user
        $existingCompare = ProductCompare::where("user_id", 1)->get();

        if ($existingCompare->count() > 0) {
            $firstCompareProduct = Product::where("product_id", $existingCompare->first()->product_id)->first();

            if ($firstCompareProduct && $firstCompareProduct->cate_id !== $productCateId) {
                return response()->json([], 500);
            }
        }

        // Thêm hoặc update sản phẩm so sánh
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
}