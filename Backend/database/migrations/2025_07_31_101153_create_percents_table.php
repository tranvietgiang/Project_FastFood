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
        Schema::create('percents', function (Blueprint $table) {
            $table->id('percent_id');
            $table->integer('percent_name');
            $table->foreignId("product_id")->constrained("products", "product_id")->onDelete("cascade")->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('percents');
    }
};