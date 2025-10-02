<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AddressUser extends Model
{
    protected $table = "address_users";
    protected $primaryKey = "address_user_id";
    protected $keyType = "int";
    public $incrementing = true;

    protected $fillable = [
        "province_name",
        "district_name",
        "ward_name",
        "user_id",
        "address_detail"
    ];
}