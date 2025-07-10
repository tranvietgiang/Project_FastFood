<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class History_search extends Model
{
    //
    protected $table = 'history_searchs'; // hoặc đúng tên bảng trong DB của bạn

    protected $primaryKey = "history_search_id";
    protected $keyType = "int";
    public $incrementing = true;

    protected $fillable = [
        'history_search_name'
    ];
}