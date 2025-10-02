<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserCompare extends Model
{
    //   
    protected $table = 'user_compares'; // hoặc đúng tên bảng trong DB của bạn
    protected $primaryKey = "user_compare_id";
    protected $keyType = "int";
    public $incrementing  = true;

    protected $fillable = [
        'product_id',
    ];
}