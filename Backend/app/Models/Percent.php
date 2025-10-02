<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Percent extends Model
{
    //
    protected $primaryKey = "percent_id";
    protected $keyType = "int";
    public $incrementing = true;
    protected $fillable = [
        'percent_name',
        'product_id'
    ];
}