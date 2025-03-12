<div class="mb-3">
    <select class="form-select" aria-label="Default select example">
        <option selected>Chọn thời gian thống kê đơn hàng</option>
        <option value="0">Theo tuần</option>
        <option value="1">Theo tháng</option>
    </select>
</div>

<canvas id="orderChart" style="width:100%; height:400px;"></canvas>

@push('scripts')
    <script>
        document.addEventListener('DOMContentLoaded', function () { 
            const pieCtx = document.getElementById('orderChart').getContext('2d');
            new Chart(pieCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Hoàn thành', 'Đang xử lý', 'Đơn hủy'],
                    datasets: [{
                        data: [
                                {{ $success['value'] }},
                                {{ $pending['value'] }},
                                {{ $cancel['value'] }},
                        ],
                        backgroundColor: [
                            'rgba(75, 192, 92, 0.8)',
                            'rgba(255, 193, 7, 0.8)',
                            'rgba(255, 99, 132, 0.8)'
                        ],
                        borderColor: [
                            'rgba(75, 192, 92, 1)',
                            'rgba(255, 193, 7, 1)',
                            'rgba(255, 99, 132, 1)'
                        ],
                        borderWidth: 2,
                        hoverOffset: 15
                    }]
                },
                options: {
                    responsive: true,
                    cutout: '65%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 15,
                                font: {
                                    size: 13
                                },
                                generateLabels: function (chart) {
                                    const data = chart.data;
                                    const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                                    return data.labels.map((label, i) => ({
                                        text: `${label} (${Math.round(data.datasets[0].data[i] / total * 100)}%)`,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        strokeStyle: data.datasets[0].borderColor[i],
                                        lineWidth: 2,
                                        hidden: isNaN(data.datasets[0].data[i]) || chart
                                            .getDatasetMeta(0).data[i].hidden,
                                        index: i
                                    }));
                                }
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            padding: 12,
                            titleFont: {
                                size: 14
                            },
                            bodyFont: {
                                size: 13
                            },
                            callbacks: {
                                label: function (context) {
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const value = context.raw;
                                    const percentage = Math.round(value / total * 100);
                                    return `${context.label}: ${value} (${percentage}%)`;
                                }
                            }
                        }
                    },
                    animations: {
                        animateRotate: true,
                        animateScale: true,
                        animations: {
                            tension: {
                                duration: 1000,
                                easing: 'easeInOutCubic',
                            }
                        }
                    },
                    animation: {
                        duration: 2000,
                        easing: 'easeInOutQuart',
                        onProgress: function (animation) {
                            const chart = animation.chart;
                            const ctx = chart.ctx;
                            const width = chart.width;
                            const height = chart.height;
    
                            // Vẽ text ở giữa
                            ctx.restore();
                            const fontSize = (height / 114).toFixed(2);
                            ctx.font = fontSize + 'em sans-serif';
                            ctx.textBaseline = 'middle';
    
                            const total = {{ $pending['value'] + $success['value'] + $cancel['value'] }};
                            const text = `${total} đơn`;
                            const textX = Math.round((width - ctx.measureText(text).width) / 2);
                            const textY = height / 2;
    
                            ctx.fillStyle = '#666';
                            ctx.fillText(text, textX, textY - fontSize * 8);
                            ctx.save();
                        }
                    }
                }
            });
        })
    </script>

@endpush