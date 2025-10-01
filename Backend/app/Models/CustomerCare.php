<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerCare extends Model
{
    //

    protected $table = "customer_cares";
    protected $primaryKey = "customer_care_id";
    public $incrementing = true;
    protected $keyType = "int";
    protected $fillable = [
        "fullname",
        "phone"
    ];
}