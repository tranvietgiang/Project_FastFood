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
}