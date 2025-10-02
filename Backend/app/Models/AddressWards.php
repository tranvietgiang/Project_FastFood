<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AddressWards extends Model
{
    protected $table = "address_wards";
    protected $primaryKey = "wards_id";
    protected $keyType = "int";
    public $incrementing = true;

    protected $fillable = [
        "district_id",
        "name"
    ];
}