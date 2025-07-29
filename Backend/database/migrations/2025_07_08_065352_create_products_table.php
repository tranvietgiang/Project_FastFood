<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id('product_id');
            $table->string('product_name', 150);
            $table->string('product_discount')->after("product_name")->default("no");
            $table->double('product_price')->default(0);
            $table->integer('product_quantity')->default(0);
            $table->string('product_desc')->nullable();
            $table->string('product_image');
            $table->foreignId('cate_id')->constrained("categories", "cate_id")->onDelete('cascade')->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};