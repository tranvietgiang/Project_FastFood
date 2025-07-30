<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{

    public function getProductSection2()
    {
        $getProducts = Product::orderBy("created_at", "desc")
            ->select("products.*", "percents.percent_name")
            ->join("percents", "products.product_id", "=", "percents.product_id")
            ->where("products.product_discount", "yes")
            ->get();


        if ($getProducts->count() > 1) {

            return response()->json($getProducts);
        }
        return response()->json([
            "message" => "Error backend",
        ], 500);
    }

    public function getProductSection3(Request $request)
    {
        $term = $request->query('termData');

        $getProduct3 = Product::where("product_name", "like", "%$term%")
            ->orderBy("created_at", "desc")
            ->limit(10)
            ->get();

        if ($getProduct3->isEmpty()) {
            return response()->json([
                "message" => "Không tìm thấy sản phẩm",
            ], 500);
        }

        // Ánh xạ từ tên -> mã
        $messageMap = [
            "Mì ý" => "1",
            "Bugger" => "2",
            "Pizza" => "3",
        ];

        $message = $messageMap[$term] ?? "unknown";

        return response()->json([
            "message" => $message,
            "products" => $getProduct3
        ]);
    }
}