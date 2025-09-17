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
        Schema::create('address_wards', function (Blueprint $table) {
            $table->id("wards_id");
            $table->foreignId("district_id")->constrained("address_districts", "district_id")->onDelete("cascade");
            $table->string("name");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('address_wards');
    }
};