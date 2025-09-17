<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AddressProvince extends Model
{
    //
    protected $table = "address_provinces";
    protected $primaryKey = "province_id";
    protected $keyType = "int";
    public $incrementing = true;

    protected $fillable = [
        "name"
    ];
}