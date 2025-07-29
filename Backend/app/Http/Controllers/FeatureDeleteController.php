<?php

namespace App\Http\Controllers;

use App\Models\History_search;
use Illuminate\Http\Request;

class FeatureDeleteController extends Controller
{
    //
    public function deleteHistory($idDelete)
    {

        if ($idDelete) {
            History_search::where("History_search_id", $idDelete)->delete();

            $getHistory = History_search::orderBy("created_at", "desc")->limit(5)->get();
            return response()->json($getHistory);
        } else {
            return response()->json([], 500);
        }
    }
}