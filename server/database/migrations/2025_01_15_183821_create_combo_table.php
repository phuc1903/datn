<?php

use App\Enums\Product\ProductStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\Combo\ComboStatus;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('combos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('admin_id');
            $table->foreign('admin_id')->references('id')->on('admins')->onDelete('cascade');
            $table->string('name');
            $table->string('image_url');
            $table->string('slug');
            $table->mediumText('short_description');
            $table->longText('description');
            $table->boolean('is_hot')->default(0);
            $table->integer('price');
            $table->integer('promotion_price');
            $table->integer('quantity');
            $table->timestamp('date_start');
            $table->timestamp('date_end')->nullable();
            $table->enum('status', ComboStatus::getValues())->default(ComboStatus::Active);
            $table->timestamps();
            $table->softDeletes();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('combos');
    }
};
