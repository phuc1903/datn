<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\Order\OrderItemStatus;
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('order_id');
            $table->unsignedBigInteger('sku_id')->nullable();
            $table->unsignedBigInteger('combo_id')->nullable();
            $table->integer('quantity');
            $table->integer('price');
            $table->enum('status',OrderItemStatus::getValues())->default(OrderItemStatus::Pending);
            $table->foreign('order_id')->references('id')->on('orders');
            $table->foreign('sku_id')->references('id')->on('skus');
            $table->foreign('combo_id')->references('id')->on('combos');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
