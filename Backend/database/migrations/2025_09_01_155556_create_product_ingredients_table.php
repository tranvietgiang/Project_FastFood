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
        Schema::create('product_ingredients', function (Blueprint $table) {
            $table->id("product_ingredient_id");
            $table->string("portion_or_measurement")->nullable();
            $table->string("Mass")->nullable();
            $table->string("Calories_or_nutrition")->nullable();
            $table->string("Promotion_or_combo")->nullable();
            $table->foreignId("product_id")->constrained("products", "product_id")->onDelete("cascade");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_ingredients');
    }
};