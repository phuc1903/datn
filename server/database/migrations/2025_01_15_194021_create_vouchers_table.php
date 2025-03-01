<?php

use App\Enums\Voucher\VoucherStatus;
use App\Enums\Voucher\VoucherType;
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
        Schema::create('vouchers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('admin_id');
            $table->foreign('admin_id')->references('id')->on('admins')->onDelete('cascade')->onDelete('cascade');
            $table->string('title');
            $table->string('description', 500)->nullable();
            $table->integer('quantity')->default(0);
            $table->enum('type', VoucherType::getValues())->default(VoucherType::Percent)->index();
            $table->integer('discount_value');
            $table->integer('max_discount_value')->nullable();
            $table->integer('min_order_value')->default(0);
            $table->enum('status', VoucherStatus::getValues())->default(VoucherStatus::Active)->index();
            $table->timestamp('started_date');
            $table->timestamp('ended_date')->nullable();
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vouchers');
    }
};
