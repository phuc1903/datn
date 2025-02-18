<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\OrderService;

class OrderServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->singleton(OrderService::class, function ($app) {
            return new OrderService();
        });
    }

    public function boot()
    {
        //
    }
}
