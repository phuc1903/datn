@php
    $notifications = [
        'success' => ['Thành công!', 4000],
        'error' => ['Có lỗi!', 4000],
        'info' => ['Thông báo!', 3000],
        'warning' => ['Cảnh báo!', 5000],
    ];
@endphp

@foreach ($notifications as $type => $details)
    @session($type)
        <script>
            document.addEventListener("DOMContentLoaded", function() {
                toastr.options = {
                    "progressBar": true,
                    "closeButton": true,    
                }
                toastr.{{ $type }}("{{ Session::get($type) }}", "{{ $details[0] }}", {
                    timeOut: {{ $details[1] }}
                });
            });

        </script>

    @endsession
@endforeach

