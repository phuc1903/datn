<h4 class="title mb-3 text-dark-custom">Thống kê doanh thu</h4>

<form id="filter-form" method="GET">
    <div class="mb-2 row">
        <div class="col-md-6">
            <x-form.input_text label="Ngày bắt đầu" type="date" name="date_start" id="date_start"
                value="{{ request('date_start') }}" />
        </div>
        <div class="col-md-6">
            <x-form.input_text label="Ngày kết thúc" type="date" name="date_end" id="date_end"
                value="{{ request('date_end') }}" />
        </div>
    </div>
    <div class="mb-3">
        <x-button.index label="Lọc" type="button" id="filter-btn" />
    </div>
</form>

<canvas id="revenueChart"></canvas>

@push('scripts')
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            const revenueCtx = document.getElementById('revenueChart').getContext('2d');
            let chartInstance = null;

            const gradientFill = revenueCtx.createLinearGradient(0, 0, 0, 300);
            gradientFill.addColorStop(0, 'rgba(237, 14, 105, 0.5)');
            gradientFill.addColorStop(1, 'rgba(237, 14, 105, 0.0)');

            function fetchData(dateStart, dateEnd) {
                $.ajax({
                    url: "{{ route('admin.dashboard') }}",
                    method: "GET",
                    data: {
                        date_start: dateStart,
                        date_end: dateEnd
                    },
                    success: function (response) {
                        const days = response.days;
                        const revenues = response.revenues;

                        if (chartInstance) {
                            chartInstance.destroy();
                        }

                        chartInstance = new Chart(revenueCtx, {
                            type: 'line',
                            data: {
                                labels: days,
                                datasets: [{
                                    label: 'Doanh thu',
                                    data: revenues,
                                    borderColor: 'rgb(237, 14, 105)',
                                    borderWidth: 3,
                                    tension: 0.4,
                                    fill: true,
                                    backgroundColor: gradientFill,
                                    pointBackgroundColor: 'rgb(237, 14, 105)',
                                    pointBorderColor: '#fff',
                                    pointBorderWidth: 2,
                                    pointRadius: 6,
                                    pointHoverRadius: 8,
                                    pointHoverBackgroundColor: '#fff',
                                    pointHoverBorderColor: 'rgb(237, 14, 105)',
                                    pointHoverBorderWidth: 3
                                }]
                            },
                            options: {
                                responsive: true,
                                interaction: {
                                    mode: 'index',
                                    intersect: false,
                                },
                                plugins: {
                                    tooltip: {
                                        callbacks: {
                                            label: function (context) {
                                                return 'Doanh thu: ' + context.parsed.y.toLocaleString() + ' đ';
                                            }
                                        }
                                    }
                                },
                                scales: {
                                    x: {
                                        grid: {
                                            display: false
                                        }
                                    },
                                    y: {
                                        beginAtZero: true,
                                        grid: {
                                            color: 'rgba(0, 0, 0, 0.05)'
                                        }
                                    }
                                }
                            }
                        });
                    }
                });
            }

            const today = new Date().toISOString().split('T')[0];

            fetchData(today, today);

            document.getElementById('filter-btn').addEventListener('click', function () {
                let dateStart = document.getElementById('date_start').value || new Date().toISOString().split('T')[0];
                let dateEnd = document.getElementById('date_end').value || new Date().toISOString().split('T')[0];

                fetchData(dateStart, dateEnd);
            });
        });


    </script>
@endpush