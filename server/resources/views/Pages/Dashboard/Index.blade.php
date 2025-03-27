@extends('layouts.app')

@section('content')
	<div class="dashboard">
		<h1 class="mb-5 text-dark-custom">Thống kê</h1>

		<div class="statistics-card mb-5">
			@if(empty($statisticsCard))
				<x-dashboard.card.index :loading="true" />
			@else
				<x-dashboard.card.index :data="$statisticsCard" :loading="false" />
			@endif
		</div>

		<div class="statistics-chart mb-5">
			<div class="row">
				<div class="col-12 col-md-6 col-lg-8 mb-3 mb-md-0">
					<div class="chart-item">
						<x-dashboard.chart.revenue_chart :statisticRevenuesChart="$statisticRevenuesChart" />
					</div>
				</div>
				<div class="col-12 col-md-6 col-lg-4">
					<div class="chart-item">
						<x-dashboard.chart.order_chart :pending="$statisticsCard['orders']['data']['toatlOrderPending']"
							:success="$statisticsCard['orders']['data']['totalOrderSuccess']"
							:cancel="$statisticsCard['orders']['data']['totalOrderCancel']" />
					</div>
				</div>
			</div>
		</div>
		
		<div class="mb-5 tab-dashboard">
			<ul class="nav nav-tabs" id="tabDashboard" role="tablist">
				<x-tab.nav_item label="Sản phẩm hết hàng" id="productOutOfStock" active />
				<x-tab.nav_item label="Sản phẩm bán chạy" id="productBestSeller"/>
				<x-tab.nav_item label="Combo hết hàng" id="comboOutOfStock"/>
				<x-tab.nav_item label="Combo bán chạy" id="comboBestSeller"/>
			</ul>
	
			<div class="tab-content mt-5" id="tabDashboardContent">
				@include('Pages.Dashboard.tab_content.combo_best_seller', ['id' => 'comboBestSeller'])
				@include('Pages.Dashboard.tab_content.combo_out_of_stock', ['id' => 'comboOutOfStock'])
				@include('Pages.Dashboard.tab_content.product_best_seller', ['id' => 'productBestSeller'])
				@include('Pages.Dashboard.tab_content.product_out_of_stock', ['id' => 'productOutOfStock'])
			</div>
		</div>
	</div>
@endsection