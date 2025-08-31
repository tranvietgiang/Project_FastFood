<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\RecentlyViewProduct;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{

    public function getProductSection2()
    {
        $getProducts = Product::orderBy("products.created_at", "desc")
            ->select(
                "products.*",
                "percents.percent_name",
                "categories.cate_name",
                "product_variants.product_id as product_variant_fk_id",
                "product_variants.product_variant_name",
                "product_variants.product_variant_price",
            )
            ->join("percents", "products.product_id", "=", "percents.product_id")
            ->leftJoin("product_variants", "products.product_id", "=", "product_variants.product_id")
            ->join("categories", "products.cate_id", "=", "categories.cate_id")
            ->where("products.product_discount", "yes")
            ->where("categories.cate_name", "not like", "%Nước uống%")
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
            "Burger" => "2",
            "Pizza" => "3",
        ];

        $message = $messageMap[$term] ?? "unknown";

        return response()->json([
            "message" => $message,
            "products" => $getProduct3
        ]);
    }

    /*git */
    public function getShowAllSection3(Request $request)
    {
        $data = $request->query("termData");

        $dk = $request->query("getLocation");

        $getProducts  = null;

        $dish = "";

        if ($dk === "Mì ý") {
            $dish = "Mi Ý";
        } else if ($dk === "Burger") {
            $dish = "Burger";
        } else {
            $dish = "Pizza";
        }


        switch ($data) {
            case "default":
                $getProducts =  Product::where("product_name", "like", "%$dish%")->orderBy("created_at", "desc")->get();
                break;
            case "increase":
                $getProducts =  Product::where("product_name", "like", "%$dish%")->orderBy("product_price")->get();
                break;
            case "decrease":
                $getProducts =  Product::where("product_name", "like", "%$dish%")->orderBy("product_price", "desc")->get();
                break;
            case "az":
                $getProducts =  Product::where("product_name", "like", "%$dish%")->orderBy("product_name")->get();
                break;
            case "za":
                $getProducts =  Product::where("product_name", "like", "%$dish%")->orderBy("product_name", "desc")->get();
                break;
            default:
                return response()->json(["error" => "Tham số không hợp lệ"], 400);
        }


        if ($getProducts && $getProducts->count() > 0) {
            return response()->json($getProducts);
        }


        return response()->json([""], 500);
    }

    /*git */
    public function getShowAllSection3Option(Request $request)
    {
        $data = $request->query('priceOption');
        $dk = $request->query('getLocation');

        if (!$data || !$dk) {
            return response()->json(['message' => 'Thiếu tham số truy vấn'], 400);
        }

        $getProductOption = null;
        $dish = "";



        $price = (int) str_replace(".", "", $data);


        if ($dk === "Mì ý") {
            $dish = "Mì ý";
        } else if ($dk === "Burger") {
            $dish = "Burger";
        } else {
            $dish = "Pizza";
        }

        // dd($price, $dish);

        $query = Product::where("product_name", "like", "%$dish%");


        if ($price <= 1000000) {
            $getProductOption =  $query->where("product_price", "<", 1000000)->get();
        } else if ($price >= 2000000 && $price < 3000000) {
            $getProductOption =  $query->whereBetween("product_price", [2000000, 3000000])->get();
        } else if ($price >= 3000000 && $price <= 4000000) {
            $getProductOption =    $query->whereBetween("product_price", [3000000, 4000000])->get();
        } else {
            $getProductOption = $query->where("product_price", ">", 5000000)->get();
        }

        if ($getProductOption->count() > 0) {
            return response()->json($getProductOption);
        }


        return response()->json([""], 500);
    }

    /*git */
    public function getProductsSection4()
    {
        $getProducts = Product::orderBy("products.created_at", "desc")->distinct()
            ->select(
                "products.*",
                "percents.percent_name",
                "product_variants.product_id as product_variant_fk_id",
                "product_variants.product_variant_name",
                "product_variants.product_variant_price"
            )
            ->leftJoin("product_variants", "products.product_id", "=", "product_variants.product_id")
            ->leftJoin("percents", "products.product_id", "=", "percents.product_id")
            ->limit(100)->get()
            ->unique("product_id")
            ->values()
            ->take(8);

        if ($getProducts->count() > 1) {

            return response()->json($getProducts);
        }
        return response()->json("", 500);
    }

    /*git */
    public function getProductsDetail($id)
    {
        $getProductDetail = Product::select(
            "products.*",
            "percents.percent_name",
            "product_variants.product_id as product_variant_fk_id",
            "product_variants.product_variant_name",
            "product_variants.product_variant_price"
        )
            ->leftJoin("percents", "products.product_id", "=", "percents.product_id")
            ->leftJoin("product_variants", "products.product_id", "=", "product_variants.product_id")

            ->where("products.product_id", $id)->first();

        if (isset($getProductDetail->product_variant_name)) {
            $getProductVariant = Product::select(
                "products.*",
                "percents.percent_name",
                "product_variants.product_id as product_variant_fk_id",
                "product_variants.product_variant_name",
                "product_variants.product_variant_price"
            )
                ->leftJoin("percents", "products.product_id", "=", "percents.product_id")
                ->leftJoin("product_variants", "products.product_id", "=", "product_variants.product_id")
                ->where("products.product_id", $id)->get();

            return response()->json([
                "first" => $getProductDetail,
                "variants" => $getProductVariant
            ], 200);
        } else {
            return response()->json($getProductDetail);
        }

        // dd($getProductDetail, $getProductVariant);


        return response()->json("", 500);
    }

    /*git */
    public function getDrinkGoTogether()
    {
        $getDrinkTogether = Product::select("products.*", "percents.percent_name")
            ->join("categories", "products.cate_id", "=", "categories.cate_id")
            ->leftJoin("percents", "products.product_id", "=", "percents.product_id")
            ->where("cate_name", "like", "%Nước uống%")
            ->get();

        if ($getDrinkTogether->count() > 1) {
            return response()->json($getDrinkTogether);
        }

        return response()->json("", 500);
    }

    /*git */
    public function getProductRelated($idDetail)
    {
        $getCate = Product::where("product_id", $idDetail)->first();

        // dd($getCate);
        if ($getCate) {
            $getProductRelated = Product::select(
                "products.*",
                "percents.percent_name",
                "product_variants.product_id as product_variant_fk_id",
                "product_variants.product_variant_name",
                "product_variants.product_variant_price"
            )
                ->leftJoin("percents", "products.product_id", "=", "percents.product_id")
                ->leftJoin("product_variants", "products.product_id", "=", "product_variants.product_id")
                ->where("products.cate_id", $getCate->cate_id)
                ->where("products.product_id", "<>", $idDetail)
                ->limit(4)->get();


            $result = $getProductRelated->unique('product_id')->values(); // loại bỏ duplicate theo product_id

            if ($result->count() < 4) {
                $missing = 4 - $result->count();

                $extraProducts = Product::select(
                    "products.*",
                    "percents.percent_name",
                    "product_variants.product_id as product_variant_fk_id",
                    "product_variants.product_variant_name",
                    "product_variants.product_variant_price"
                )
                    ->leftJoin("percents", "products.product_id", "=", "percents.product_id")
                    ->leftJoin("product_variants", "products.product_id", "=", "product_variants.product_id")
                    ->where("products.cate_id", "<>", $getCate->cate_id)
                    ->where("products.product_id", "<>", $idDetail)
                    ->inRandomOrder()
                    ->limit($missing)->get();

                $mergeRelated = $getProductRelated->merge($extraProducts);
                return response()->json($mergeRelated);
            }
        }

        return response()->json([], 404);
    }

    /*git */
    public function getProductViewRecently($idViewRecently)
    {

        $exist = Product::where("product_id", $idViewRecently)->exists();

        if ($exist) {
            RecentlyViewProduct::updateOrCreate(
                [
                    "user_id" => 1,
                    "product_id" => $idViewRecently
                ],
                [
                    'viewed_count' => DB::raw("viewed_count + 1")
                ]
            );

            $getRecentlyViewProduct = RecentlyViewProduct::select(
                "recently_view_products.*",
                "products.*",
                "percents.percent_name",
                "product_variants.product_id as product_variant_fk_id",
                "product_variants.product_variant_name",
                "product_variants.product_variant_price"
            )
                ->join("products", "recently_view_products.product_id", "=", "products.product_id")->leftJoin("product_variants", "products.product_id", "=", "product_variants.product_id")
                ->leftJoin("percents", "products.product_id", "=", "percents.product_id")
                ->where("products.product_id", "<>", $idViewRecently)
                ->orderBy("recently_view_products.viewed_count", "desc")
                ->limit(20)->get()
                ->unique('product_id')
                ->values()             // reset index 0,1,2...
                ->take(8);


            if ($getRecentlyViewProduct->count() > 0) {
                return response()->json($getRecentlyViewProduct);
            }
        }

        return response()->json([], 200);
    }
}