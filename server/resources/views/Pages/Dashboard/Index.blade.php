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
				<div class="col-12 col-md-6 col-lg-8">
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
		@if(isset($productsOutOfStock) && $productsOutOfStock->count() !== 0)
			<div class="statistic-product-outOfStock">
				@if(empty($productsOutOfStock))
					<x-dashboard.product.index title="Thống kê 8 sản phẩm sắp hết hàng" :loading="true" />
				@else
					<x-dashboard.product.index title="Thống kê 8 sản phẩm sắp hết hàng" :products="$productsOutOfStock"
						:loading="false" />
				@endif
			</div>
		@endif
		@if(isset($productBestSeller) && $productBestSeller->count() !== 0)
			<div class="statistic-product-outOfStock">
				@if(empty($productBestSeller))
					<x-dashboard.product.index title="Thống kê 8 sản phẩm bán chạy" :loading="true" />
				@else
					<x-dashboard.product.index title="Thống kê 8 sản phẩm bán chạy" :products="$productBestSeller"
						:loading="false" />
				@endif
			</div>
		@endif
		@if(isset($combosBestSeller) && $combosBestSeller->count() !== 0)
			<div class="statistic-product-outOfStock">
				@if(empty($combosBestSeller))
					<x-dashboard.combo.index title="Thống kê 8 combo bán chạy" :loading="true" />
				@else
					<x-dashboard.combo.index title="Thống kê 8 combo bán chạy" :combos="$combosBestSeller" :loading="false" />
				@endif
			</div>
		@endif
		@if(isset($combosOutOfStock) && $combosOutOfStock->count() !== 0)
			<div class="statistic-product-outOfStock">
				@if(empty($combosOutOfStock))
					<x-dashboard.combo.index title="Thống kê 8 combo bán chạy" :loading="true" />
				@else
					<x-dashboard.combo.index title="Thống kê 8 combo bán chạy" :combos="$combosOutOfStock" :loading="false" />
				@endif
			</div>
		@endif

	</div>
@endsection