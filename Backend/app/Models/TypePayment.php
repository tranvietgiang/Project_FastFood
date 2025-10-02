<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TypePayment extends Model
{
    //
    protected $table = 'type_payments'; // hoặc đúng tên bảng trong DB của bạn

    protected $primaryKey = "type_payment_id";
    protected $keyType = "int";
    public $incrementing = true;

    protected $fillable = [
        'type_payment_name',
        'type_payment_method'
    ];
}