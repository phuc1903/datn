<div class="mb-3">
    <select class="form-select" aria-label="Default select example">
        <option selected>Chọn thời gian thống kê doanh thu</option>
        <option value="0">Theo tuần</option>
        <option value="1">Theo tháng</option>
    </select>
</div>

<canvas id="revenueChart"></canvas>

@push('scripts')
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            const revenueCtx = document.getElementById('revenueChart').getContext('2d');

            const gradientFill = revenueCtx.createLinearGradient(0, 0, 0, 300);
            gradientFill.addColorStop(0, 'rgba(237, 14, 105, 0.5)');
            gradientFill.addColorStop(1, 'rgba(237, 14, 105, 0.0)');

            const months = {!! json_encode($statisticRevenuesChart['months']) !!};

            const monthNamesInVietnamese = {
                'Jan': 'Tháng 1', 'Feb': 'Tháng 2', 'Mar': 'Tháng 3', 'Apr': 'Tháng 4', 'May': 'Tháng 5', 'Jun': 'Tháng 6',
                'Jul': 'Tháng 7', 'Aug': 'Tháng 8', 'Sep': 'Tháng 9', 'Oct': 'Tháng 10', 'Nov': 'Tháng 11', 'Dec': 'Tháng 12'
            };

            const monthsInVietnamese = months.map(function (month) {
                return monthNamesInVietnamese[month] || month; // Ánh xạ tháng
            });

            new Chart(revenueCtx, {
                type: 'line',
                data: {
                    labels: monthsInVietnamese,
                    datasets: [{
                        label: 'Doanh thu',
                        data: {!! json_encode($statisticRevenuesChart['data']) !!},
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
                    animations: {
                        tension: {
                            duration: 1000,
                            easing: 'easeInOutCubic',
                            from: 0.6,
                            to: 0.1,
                            loop: true
                        },
                        y: {
                            duration: 2000,
                            easing: 'easeInOutQuart',
                            delay: function (ctx) {
                                return ctx.dataIndex * 100;
                            },
                            loop: false
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                font: {
                                    size: 14,
                                    weight: 'bold'
                                }
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            padding: 12,
                            titleFont: {
                                size: 16,
                                weight: 'bold'
                            },
                            bodyFont: {
                                size: 14
                            },
                            displayColors: false,
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
        });
    </script>
@endpush