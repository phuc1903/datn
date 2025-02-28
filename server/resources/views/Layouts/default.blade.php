<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" data-theme="{{ session('theme', 'light') }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="icon" href="{{ config('settings.logo_icon') }}" type="image/x-icon">
    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=Nunito" rel="stylesheet">

    <!-- Scripts -->
    @vite(['resources/sass/app.scss', 'resources/js/app.js', 'resources/css/sb-admin-2.min.css'])
</head>

<body class="bg-neuture-50 text-neuture-900" id="page-top">

    <div style="background-image: url('image/SKINCARE AND BEAUTY CLINIC BANNER ADVERTISEMENT.png');">
        @yield('content')
    </div>

    <x-toastr.index />

</body>

</html>
