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
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id("product_variant_id");
            $table->string("product_variant_name");
            $table->decimal('product_variant_price', 10, 2)->default(0);
            $table->integer("product_variant_quantity")->default(0);
            $table->foreignId('product_id')->constrained('products', "product_id")->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};