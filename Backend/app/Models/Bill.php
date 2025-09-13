<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bill extends Model
{
    //

    protected $primaryKey = "bill_id";
    protected $keyType = "int";
    public $incrementing = true;

    protected $fillable = [
        "product_id",
        "user_id",
        "payment_id",
        "bill_price_total",
        "bill_quantity",
        "apptransid"
    ];
}