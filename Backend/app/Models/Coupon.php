<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    //
    protected $primaryKey = "coupon_id";
    protected $keyType = "int";
    public $incrementing = true;
    protected $fillable = [
        'coupon_name'
    ];
}