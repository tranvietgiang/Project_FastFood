<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use App\Models\Product;
use Illuminate\Http\Request;

class FeatureSearchController extends Controller
{


    /*Send cate when user choose cate */
    public function Search(Request $request)
    {
        $keyWord = $request->query('category');
        $search = Categorie::where("cate_name", "like", "%$keyWord%")->first();
        return response($search);
    }

    /*Receive data(cate) api send and show product belong cate */
    public function searchCate($cateSearch)
    {
        $pCate = Product::select('categories.cate_name', 'products.*')
            ->join('categories', 'products.cate_id', "=", "categories.cate_id")
            ->where('categories.cate_name', 'like', "%$cateSearch%")
            ->paginate(10);


        return response()->json($pCate);
    }


    /*User input data search */
    public function userSearch(Request $request)
    {
        $input = $request->query('input');
        $userInput = Product::where("product_name", "like", "%$input%")->paginate(20);
        return response()->json($userInput);
    }
}