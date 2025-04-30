<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\User\UserAddress;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_addresses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->string('address');

            $table->string('province_code', 20);
            $table->string('district_code', 20);
            $table->string('ward_code', 20);

            $table->foreign('province_code')->references('code')->on('provinces')->onDelete('cascade');
            $table->foreign('district_code')->references('code')->on('districts')->onDelete('cascade');
            $table->foreign('ward_code')->references('code')->on('wards')->onDelete('cascade');

            $table->string('name');
            $table->string('phone_number');
            $table->enum('default', UserAddress::getValues());
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_addresses');
    }
};
