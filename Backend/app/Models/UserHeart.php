<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserHeart extends Model
{
    //
    protected $table = "user_hearts";
    protected $primaryKey = "user_heart_id";
    protected $keyType = "int";
    public $incrementing = true;

    protected $fillable = [
        "product_id",
        "user_id"
    ];
}