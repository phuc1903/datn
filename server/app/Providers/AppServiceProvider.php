<?php

namespace App\Providers;

use Illuminate\Support\Facades\Config;
use Illuminate\Support\ServiceProvider;
use Yajra\DataTables\Html\Builder;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Builder::useVite();
        Config::set('settings.image_default', asset(Config::get('settings.image_default')));
        Config::set('settings.logo_icon', asset(Config::get('settings.logo_icon')));
    }
}
