<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariants extends Model
{
    //

    protected $primaryKey = "product_variant_id";
    protected $keyType = "int";
    public $incrementing = true;

    protected $fillable = [
        "product_variant_name",
        "product_variant_price",
        "product_variant_quantity",
        "product_id"
    ];
}
