@extends('layouts.app')

@section('content')
    <h1 class="mb-5 text-dark-custom">Cài đặt chung</h1>

    <div class="mb-5 tab-dashboard">
        <ul class="nav nav-tabs" id="tabDashboard" role="tablist">
            <x-tab.nav_item label="Cài đặt chung" id="settingGeneral" active />
            <x-tab.nav_item label="Cài đặt logo" id="logo" />
            <x-tab.nav_item label="Cài đặt Footer" id="footer" />
            <x-tab.nav_item label="Cài đặt Về chúng tôi" id="about" />
            <x-tab.nav_item label="Cài đặt Liên hệ" id="contact" />
        </ul>

        <div class="tab-content mt-5" id="tabDashboardContent">
            @include('Pages.Setting.tab_content.General', ['id' => 'settingGeneral'])
            @include('Pages.Setting.tab_content.Logo', ['id' => 'logo'])
            @include('Pages.Setting.tab_content.Footer', ['id' => 'footer'])
            @include('Pages.Setting.tab_content.About', ['id' => 'about'])
            @include('Pages.Setting.tab_content.Contact', ['id' => 'contact'])
        </div>,
    </div>

@endsection

