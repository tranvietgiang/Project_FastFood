<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AddressDistrict extends Model
{
    protected $table = "address_districts";
    protected $primaryKey = "district_id";
    protected $keyType = "int";
    public $incrementing = true;

    protected $fillable = [
        "province_id",
        "name"
    ];
}