import './bootstrap';
import 'laravel-datatables-vite';

document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("theme-toggle");
    const currentTheme = localStorage.getItem("theme") || "light";

    document.body.setAttribute("data-theme", currentTheme);

    themeToggle.addEventListener("click", function () {
        const newTheme = document.body.getAttribute("data-theme") === "light" ? "dark" : "light";
        document.body.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    });
});

(function ($) {
    "use strict";

    // Toggle Sidebar
    $("#sidebarToggle, #sidebarToggleTop").on("click", function () {
        $("body").toggleClass("sidebar-toggled");
        $(".sidebar").toggleClass("toggled");
        $('.accordion-button-custom').addClass('active');

        if ($(".sidebar").hasClass("toggled")) {
            $(".sidebar .collapse").collapse("hide");
        }

        if($('.accordion-button-custom').hasClass('active')) {
            $('.accordion-button-custom').removeClass('active');
        }
    });

    // Hide sidebar collapse on window resize
    $(window).resize(function () {
        if ($(window).width() < 768) {
            $(".sidebar .collapse").collapse("hide");
        }

        if ($(window).width() < 480 && !$(".sidebar").hasClass("toggled")) {
            $("body").addClass("sidebar-toggled");
            $(".sidebar").addClass("toggled");
            $('.accordion-button-custom').addClass('active');
            $(".sidebar .collapse").collapse("hide");
        }
    });

    // Prevent sidebar scrolling when using mouse wheel
    $("body.fixed-nav .sidebar").on("mousewheel DOMMouseScroll wheel", function (e) {
        if ($(window).width() > 768) {
            var event = e.originalEvent;
            var delta = event.wheelDelta || -event.detail;
            this.scrollTop += 30 * (delta < 0 ? 1 : -1);
            e.preventDefault();
        }
    });

    // Show/hide "scroll to top" button on scroll
    $(document).on("scroll", function () {
        if ($(this).scrollTop() > 100) {
            $(".scroll-to-top").fadeIn();
        } else {
            $(".scroll-to-top").fadeOut();
        }
    });

    // Smooth scroll to top
    $(document).on("click", "a.scroll-to-top", function (e) {
        var target = $(this);
        $("html, body").stop().animate(
            { scrollTop: $(target.attr("href")).offset().top },
            1000,
            "easeInOutExpo"
        );
        e.preventDefault();
    });

})(jQuery);

// $(document).ready(function () {
//     $('#upload-image').on('click', function () {
//         $('#image-upload').click();
//     });

//     // Khi người dùng chọn file
//     $('#image-upload').on('change', function () {
//         // Kiểm tra nếu có file được chọn
//         var fileData = $('#image-upload')[0].files[0];
//         if (fileData) {
//             var formData = new FormData();
//             formData.append('image-upload', fileData); // Thêm file vào FormData

//             // Gửi AJAX để upload file
//             // $.ajax({
//             //     url: '/upload',  // Thay đổi URL thành route xử lý upload của bạn
//             //     type: 'POST',
//             //     data: formData,
//             //     processData: false,  // Không xử lý dữ liệu
//             //     contentType: false,  // Không tự động thiết lập Content-Type
//             //     success: function (response) {
//             //         // Xử lý khi upload thành công
//             //         console.log('Upload thành công:', response);
//             //     },
//             //     error: function (xhr, status, error) {
//             //         // Xử lý khi có lỗi
//             //         console.error('Lỗi khi upload:', error);
//             //     }
//             // });
//         }
//     });
// });
