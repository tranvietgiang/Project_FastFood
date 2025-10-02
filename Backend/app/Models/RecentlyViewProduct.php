<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RecentlyViewProduct extends Model
{
    //
    protected $primaryKey = "rvp_product_id";
    protected $keyType = "int";
    public $incrementing  = true;

    protected $fillable = [
        'user_id',
        'product_id',
        'viewed_count'
    ];
}
