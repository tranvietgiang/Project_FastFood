<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductIngredient extends Model
{
    //
    protected $primaryKey = "product_ingredient_id";
    protected $keyType = "int";
    public $incrementing = true;

    protected $fileable = [
        "portion_or_measurement",
        "Mass",
        "Calories_or_nutrition",
        "Promotion_or_combo",
        "product_id"
    ];
}