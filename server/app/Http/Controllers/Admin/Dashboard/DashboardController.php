<?php

namespace App\Http\Controllers\Admin\Dashboard;

use App\Enums\Order\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $totalOrder = Order::count();
        $toatlOrderCancel = Order::where('status', OrderStatus::Cancel)->count();

        return view('Pages.Dashboard.Index', compact('totalOrder', 'toatlOrderCancel'));
    }
}
