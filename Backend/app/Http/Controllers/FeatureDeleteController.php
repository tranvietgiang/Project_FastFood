<?php

namespace App\Http\Controllers;

use App\Models\History_search;
use App\Models\ProductCompare;
use Illuminate\Http\Request;

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

    public function deleteCompareId($compareId, $userId)
    {
        if (isset($compareId) && isset($userId)) {
            ProductCompare::where("user_id", $userId)->where("product_id", $compareId)->delete();
        }

        $getCompare = ProductCompare::select("product_compares.*", "products.*")
            ->Join("products", "product_compares.product_id", "=", "products.product_id")->limit(3)->get();

        if ($getCompare->count() > 0) {
            return response()->json($getCompare);
        }

        return response()->json([], 500);
    }
    public function deleteCompareAll($userId)
    {
        if (isset($userId)) {
            ProductCompare::where("user_id", $userId)->delete();
            return response()->json([], 200);
        }
    }
}
