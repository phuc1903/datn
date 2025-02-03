<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductFeedback extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected $table = 'product_feedbacks';

    public function product()
    {
        return $this->beLongsTo(Product::class, 'product_id');
    }
}
