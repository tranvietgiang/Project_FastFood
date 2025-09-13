<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderCart extends Model
{
    //
    protected $table = 'order_carts'; // hoặc đúng tên bảng trong DB của bạn

    protected $primaryKey = "cart_id";
    protected $keyType = "int";
    public $incrementing = true;

    protected $fillable = [
        "product_id",
        "user_id",
        'cart_quantity',
        'current_price'
    ];
}