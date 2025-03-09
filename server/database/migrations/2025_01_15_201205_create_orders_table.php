<?php

use App\Enums\Order\OrderPaymentMethod;
use App\Enums\Order\OrderStatus;
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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('voucher_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('voucher_id')->references('id')->on('vouchers');
            $table->string('full_name');
            $table->string('email');
            $table->string('phone_number');
            $table->string('address');

            $table->string('province_code', 20);
            $table->string('district_code', 20);
            $table->string('ward_code', 20);

            $table->foreign('province_code')->references('code')->on('provinces')->onDelete('cascade');
            $table->foreign('district_code')->references('code')->on('districts')->onDelete('cascade');
            $table->foreign('ward_code')->references('code')->on('wards')->onDelete('cascade');

            $table->enum('payment_method', OrderPaymentMethod::getValues());
            $table->enum('status', OrderStatus::getValues())->default(OrderStatus::Pending);
            $table->integer('shipping_cost');
            $table->integer('total_amount');
            $table->integer('discount_amount');
            $table->string('note')->nullable();
            $table->string('reason')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
