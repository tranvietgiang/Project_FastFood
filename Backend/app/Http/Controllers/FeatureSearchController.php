<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use App\Models\History_search;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class FeatureSearchController extends Controller
{


    /*Send cate when user choose cate */
    public function Search(Request $request)
    {
        $keyWord = $request->query('category');

        $search = Categorie::where("cate_name", "like", "%$keyWord%")->first();
        if (!$search) {

            return response([], 404);
        }
        return response($search);
    }

    /*Receive data(cate) api send and show product belong cate */
    public function searchCate($cateSearch)
    {
        if (!Categorie::where('cate_name', $cateSearch)->exists()) {
            return response([], 404);
        }

        $pCate = Product::select(
            'categories.cate_name',
            'products.*',
            "percents.percent_name",
            "product_variants.product_id as product_variant_fk_id",
            "product_variants.product_variant_name",
            "product_variants.product_variant_price"
        )
            ->join('categories', 'products.cate_id', "=", "categories.cate_id")
            ->leftJoin("product_variants", "products.product_id", "=", "product_variants.product_id")
            ->leftJoin("percents", "products.product_id", "=", "percents.product_id")
            ->where('categories.cate_name', 'like', "%$cateSearch%")
            ->get();

        if ($pCate->count() > 0) {

            return response()->json($pCate);
        }


        return response()->json([], 500);
    }


    /*User input data search */
    public function userSearch(Request $request)
    {
        $input = $request->query('input');
        $userInput = Product::select(
            "products.*",
            "percents.percent_name",
            "product_variants.product_id as product_variant_fk_id",
            "product_variants.product_variant_name",
            "product_variants.product_variant_price"
        )
            ->leftJoin("product_variants", "products.product_id", "=", "product_variants.product_id")
            ->leftJoin("percents", "products.product_id", "=", "percents.product_id")
            ->where("product_name", "like", "%$input%")->get();

        return response()->json($userInput);
    }

    public function saveHistory(Request $request)
    {
        $history = $request->history;

        if ($history) {
            $exists = History_search::where("history_search_name", $history)->first();
            if (!$exists) {
                History_search::create([
                    'history_search_name' => $history,
                    "user_id" => 1
                ]);
            } else {
                $exists->created_at = Carbon::now();
                $exists->save();
            }
        }

        // Trả về danh sách mới luôn
        return $this->getHistory();
    }

    // get data history
    public function getHistory()
    {
        $getHistory = History_search::orderBy("created_at", "desc")->limit(5)->get();
        return response()->json($getHistory);
    }

    // 
    public function historySearch($dataHistory)
    {
        $searchHistory = History_search::where("history_search_name", $dataHistory)->exists();

        if ($searchHistory) {
            return response()->json("successfully", 200);
        }

        return response()->json("not successfully!", 404);
    }

    public function productHistory($dataHistory)
    {
        $searchHistory = History_search::where("History_search_name", "like", "%$dataHistory%")->exists();
        if ($searchHistory) {
            $getProduct = Product::select(
                "products.*",
                "percents.percent_name",
                "product_variants.product_id as product_variant_fk_id",
                "product_variants.product_variant_name",
                "product_variants.product_variant_price"
            )
                ->leftJoin("percents", "products.product_id", "=", "percents.product_id")
                ->leftJoin("product_variants", "products.product_id", "=", "product_variants.product_id")
                ->where("product_name", "like", "%$dataHistory%")
                ->orderBy("created_at", "desc")->get();
            return response()->json($getProduct);
        }

        return response()->json([], 404);
    }
}