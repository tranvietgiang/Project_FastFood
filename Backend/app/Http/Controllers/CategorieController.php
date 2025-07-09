<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use Illuminate\Http\Request;

class CategorieController extends Controller
{
    public function getCate()
    {
        return response()->json(Categorie::pluck('cate_name'));
    }
}