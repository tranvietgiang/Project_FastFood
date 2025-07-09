<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Categorie extends Model
{
    //
    protected $primaryKey = "cate_id";
    protected $keyType = "int";
    public $incrementing = true;
    protected $fillable = [
        "cate_name"
    ];
}