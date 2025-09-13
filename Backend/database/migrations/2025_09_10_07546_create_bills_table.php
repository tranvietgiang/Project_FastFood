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
        Schema::create('bills', function (Blueprint $table) {
            $table->id("bill_id");
            $table->foreignId("product_id")->constrained("products", "product_id");
            $table->foreignId("user_id")->constrained("users")->onDelete("Cascade");
            $table->foreignId("payment_id")->constrained("type_payments", "type_payment_id")->onDelete("Cascade");
            $table->foreignId("cart_id")->nullable()->constrained("order_carts", "cart_id")->onDelete("cascade");
            $table->decimal("bill_price_total", 10, 2)->default(0);
            $table->integer("bill_quantity")->default(0);
            $table->string("apptransid");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bills');
    }
};