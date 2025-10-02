<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CouponUser extends Model
{
    //
    protected $table = 'coupon_users'; // hoặc đúng tên bảng trong DB của bạn

    protected $primaryKey = "coupon_user_id";
    protected $keyType = "int";
    // public $incrementing = true;


    protected $fillable = [
        'coupon_user_id',
        'coupon_user_name',
        "coupon_user_percent",
        "coupon_user_minimum_price",
        "user_id",
        "created_at"
    ];
}