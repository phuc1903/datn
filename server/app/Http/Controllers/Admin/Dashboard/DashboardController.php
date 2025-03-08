<?php

namespace App\Http\Controllers\Admin\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $totalOrder = Order::count();
        $order = Order::all();

        return view('Pages.Dashboard.Index', compact('totalOrder'));
    }
}
