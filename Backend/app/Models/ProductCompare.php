<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductCompare extends Model
{
    //

    protected $primaryKey = "product_compare_id";
    protected $keyType = "int";
    public $incrementing = true;

    protected $fillable = [
        "product_id",
        "user_id"
    ];
}