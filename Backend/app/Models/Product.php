<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    //
    protected $primaryKey = "product_id";
    protected $keyType = "int";
    public $incrementing = true;
    protected $fillable = [
        'product_name',
        'product_price',
        'product_quantity',
        'product_desc',
        'product_note',
        'product_image',
    ];
}