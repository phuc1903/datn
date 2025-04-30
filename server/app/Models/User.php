<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\User\UserSex;
use App\Enums\User\UserStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    protected $guarded = [];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */


    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'random_flag' => 'boolean',
        'user_status' => UserStatus::class,
        'user_sex' => UserSex::class,
    ];


    public function addresses()
    {
        return $this->hasMany(UserAddress::class, 'user_id');
    }

    public function carts()
    {
        return $this->hasMany(UserCart::class, 'user_id');
    }


    public function favorites()
    {
        return $this->belongsToMany(Product::class, 'user_favorites', 'user_id', 'product_id')->withTimestamps();
    }



    public function vouchers()
    {
        return $this->belongsToMany(Voucher::class, 'user_vouchers');
    }


    public function productFeedbacks()
    {
        return $this->hasMany(ProductFeedback::class, 'user_id');
    }

    public function feedbacks()
    {
        return $this->belongsToMany(Sku::class, 'product_feedbacks', 'user_id', 'sku_id')
            ->withPivot('rating', 'content')  // Đảm bảo lấy thêm rating và comment
            ->withTimestamps();  // Lấy timestamps nếu có
    }


    public function orders()
    {
        return $this->hasMany(Order::class, 'user_id');
    }


}
