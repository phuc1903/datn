<?php

namespace App\Http\Controllers\Admin\Dashboard;

use App\Enums\Combo\ComboStatus;
use App\Enums\Order\OrderStatus;
use App\Enums\Product\ProductStatus;
use App\Http\Controllers\Controller;
use App\Models\Combo;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Sku;
use App\Models\User;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {

        $statisticsCard = [
            'revenues' => $this->statisticRevenuesCard(),
            'orders' => $this->statisticOrdersCard(),
            'users' => $this->statisticUsersCard(),
        ];

        $statisticRevenuesChart = $this->statisticRevenuesChart();

        $productsOutOfStock = $this->productsOutOfStock();

        $productBestSeller = $this->productBestSeller();

        $combosBestSeller = $this->combosBestSeller();

        $combosOutOfStock = $this->combosOutOfStock();

        // dd($combosOutOfStock);

        return view(
            'Pages.Dashboard.Index',
            compact(
                'statisticsCard',
                'statisticRevenuesChart',
                'productsOutOfStock',
                'productBestSeller',
                'combosBestSeller',
                'combosOutOfStock'
            )
        );
    }

    protected function statisticUsersCard()
    {
        $totalCustomerToDay = User::whereDate('created_at', today())->count();
        $totalCustomerThisMonth = User::whereMonth('created_at', now()->month)->whereYear('created_at', now()->year)->count();
        $totalCustomerThisYear = User::whereYear('created_at', now()->year)->count();

        return [
            'data' => [
                'totalCustomerToDay' => ['title' => "KH mới hôm nay", 'value' => $totalCustomerToDay, 'color' => 'warning'],
                'totalCustomerThisMonth' => ['title' => "KH mới trong tháng", 'value' => $totalCustomerThisMonth, 'color' => 'warning'],
                'totalCustomerThisYear' => ['title' => "KH mới trong năm", 'value' => $totalCustomerThisYear, 'color' => 'warning'],
            ],
            'icon' => '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                        </svg>'
        ];
    }
    protected function statisticRevenuesCard()
    {
        $totalRevenueToDay = Order::whereDate('created_at', today())->sum('total_amount');
        $totalRevenueThisMonth = Order::whereMonth('created_at', now()->month)->whereYear('created_at', now()->year)->sum('total_amount');
        $totalRevenueThisYear = Order::whereYear('created_at', now()->year)->sum('total_amount');

        return [
            'data' => [
                'totalRevenueToDay' => ['title' => "Doanh thu hôm nay", 'value' => $totalRevenueToDay,],
                'totalRevenueThisMonth' => ['title' => "Doanh thu trong tháng", 'value' => $totalRevenueThisMonth],
                'totalRevenueThisYear' => ['title' => "Doanh thu trong năm", 'value' => $totalRevenueThisYear],
            ],
            'icon' => '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cash-coin" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M11 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8m5-4a5 5 0 1 1-10 0 5 5 0 0 1 10 0"/>
                            <path d="M9.438 11.944c.047.596.518 1.06 1.363 1.116v.44h.375v-.443c.875-.061 1.386-.529 1.386-1.207 0-.618-.39-.936-1.09-1.1l-.296-.07v-1.2c.376.043.614.248.671.532h.658c-.047-.575-.54-1.024-1.329-1.073V8.5h-.375v.45c-.747.073-1.255.522-1.255 1.158 0 .562.378.92 1.007 1.066l.248.061v1.272c-.384-.058-.639-.27-.696-.563h-.668zm1.36-1.354c-.369-.085-.569-.26-.569-.522 0-.294.216-.514.572-.578v1.1zm.432.746c.449.104.655.272.655.569 0 .339-.257.571-.709.614v-1.195z"/>
                            <path d="M1 0a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4.083q.088-.517.258-1H3a2 2 0 0 0-2-2V3a2 2 0 0 0 2-2h10a2 2 0 0 0 2 2v3.528c.38.34.717.728 1 1.154V1a1 1 0 0 0-1-1z"/>
                            <path d="M9.998 5.083 10 5a2 2 0 1 0-3.132 1.65 6 6 0 0 1 3.13-1.567"/>
                        </svg>'
        ];
    }
    protected function statisticOrdersCard()
    {
        $totalOrder = Order::count();
        $toatlOrderCancel = Order::where('status', OrderStatus::Cancel)->count();
        $toatlOrderSuccess = Order::where('status', OrderStatus::Success)->count();
        $toatlOrderPending = Order::where('status', OrderStatus::Pending)->count();
        $totalOrderShiping = Order::where('status', OrderStatus::Shipped)->count();

        return [
            'data' => [
                'totalOrder' => ['title' => "Tổng đơn hàng", 'value' => $totalOrder, 'color' => 'primary'],
                'totalOrderCancel' => ['title' => "Đơn hàng bị hủy", 'value' => $toatlOrderCancel, 'color' => 'danger'],
                'totalOrderSuccess' => ['title' => "Đơn hàng thành công", 'value' => $toatlOrderSuccess, 'color' => 'success'],
                'toatlOrderPending' => ['title' => "Đơn hàng đang xử lý", 'value' => $toatlOrderPending, 'color' => 'warning'],
                'totalOrderShiping' => ['title' => 'Đơn hàng đang giao', 'value' => $totalOrderShiping, 'color' => 'neuture'],
            ],
            'icon' => '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-receipt" viewBox="0 0 16 16">
                            <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27m.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0z"/>
                            <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5m8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5"/>
                        </svg>'
        ];
    }

    protected function statisticRevenuesChart()
    {
        $currentYear = Carbon::now()->year;

        $months = [];
        Carbon::setLocale('vi');

        for ($i = 0; $i < 12; $i++) {
            $months[] = Carbon::now()->startOfYear()->addMonths($i)->format('M');
        }

        $monthlyRevenue = [];
        foreach ($months as $month) {
            $monthlyRevenue[] = Order::whereYear('created_at', $currentYear)
                ->whereMonth('created_at', Carbon::parse($month)->month)
                ->where('status', OrderStatus::Success)
                ->sum('total_amount');
        }

        return ['months' => $months, 'data' => $monthlyRevenue];
    }

    protected function statisticOrderChart()
    {
        $dataOrder = $this->statisticOrdersCard();

        return [
            'orderPending' => $dataOrder['data']['toatlOrderPending'],
            'orderSuccess' => $dataOrder['data']['toatlOrderSuccess'],
            'orderCancel' => $dataOrder['data']['toatlOrderCancel'],
        ];
    }

    protected function productsOutOfStock()
    {
        $products = Sku::where('quantity', '<', 10)->whereHas('product', function($query) {
            $query->where('status', ProductStatus::Active);
        })
        ->with('product', 'variantValues')->limit(8)->get();

        return $products;
    }

    protected function productBestSeller()
    {
        $bestSellers = Sku::select('skus.id','skus.image_url', 'skus.quantity', 'skus.product_id', \DB::raw('SUM(order_items.quantity) as total_quantity'))
            ->join('order_items', 'order_items.sku_id', '=', 'skus.id') 
            ->whereHas('product', function($query) {
                $query->where('status', ProductStatus::Active);
            })
            ->groupBy('skus.id', 'skus.product_id') 
            ->orderByDesc('total_quantity')
            ->limit(8) 
            ->with('product', 'variantValues') 
            ->get();

        return $bestSellers;
    }

    protected function combosBestSeller()
    {
        $bestSellers = Combo::select('combos.id', 'combos.name', 'combos.image_url', 'combos.quantity' ,'combos.status', \DB::raw('SUM(order_items.quantity) as total_quantity'))
            ->join('order_items', 'order_items.combo_id', '=', 'combos.id')
            ->where('combos.status', ComboStatus::Active)
            ->groupBy('combos.id')
            ->orderByDesc('total_quantity')
            ->limit(8)
            ->get();

        return $bestSellers;
    }

    protected function combosOutOfStock()
    {
        $combos = Combo::where('quantity', '<', 10)->where('status', ComboStatus::Active)->get();

        return $combos;
    }
}
