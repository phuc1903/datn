import $ from "jquery";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import Swal from "sweetalert2";

import { isArray } from "jquery";
import "./bootstrap";
import "laravel-datatables-vite";

window.Swal = Swal;
window.$ = window.jQuery = $;
window.toastr = toastr;

(function ($) {
    "use strict";

    // Toggle Sidebar
    $("#sidebarToggle, #sidebarToggleTop").on("click", function () {
        $("body").toggleClass("sidebar-toggled");
        $(".sidebar").toggleClass("toggled");
        $(".accordion-button-custom").addClass("active");

        if ($(".sidebar").hasClass("toggled")) {
            $(".sidebar .collapse").collapse("hide");
        }

        if ($(".accordion-button-custom").hasClass("active")) {
            $(".accordion-button-custom").removeClass("active");
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
            $(".accordion-button-custom").addClass("active");
            $(".sidebar .collapse").collapse("hide");
        }
    });

    // Prevent sidebar scrolling when using mouse wheel
    $("body.fixed-nav .sidebar").on(
        "mousewheel DOMMouseScroll wheel",
        function (e) {
            if ($(window).width() > 768) {
                var event = e.originalEvent;
                var delta = event.wheelDelta || -event.detail;
                this.scrollTop += 30 * (delta < 0 ? 1 : -1);
                e.preventDefault();
            }
        }
    );

    // Show/hide "scroll to top" button on scroll
    $(document).on("scroll", function () {
        if ($(this).scrollTop() > 100) {
            $(".scroll-to-top").fadeIn();
        } else {
            $(".scroll-to-top").fadeOut();
        }
    });

    // Smooth scroll to top
    // $(document).on("click", "a.scroll-to-top", function (e) {
    //     var target = $(this);
    //     $("html, body").stop().animate(
    //         { scrollTop: $(target.attr("href")).offset().top },
    //         1000,
    //         "easeInOutExpo"
    //     );
    //     e.preventDefault();
    // });
})(jQuery);

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
$(document).ready(function () {
    addAddress();
    deleteUser();

    function addAddress() {
        const addressContainer = $("#address-books");
        const addressesDatabase = addressContainer.data("addresses");
    
        const addressTemplate = () => [
            { label: "Tỉnh/Thành phố", name: "city", value: "" },
            { label: "Quận/Huyện", name: "district", value: "" },
            { label: "Xã/Phường", name: "ward", value: "" },
            { label: "Địa chỉ cụ thể", name: "address", value: "" },
        ];
    
        let addresses = [];
    
        if (Array.isArray(addressesDatabase) && addressesDatabase.length > 0) {
            addresses = addressesDatabase.map((address) => [
                { label: "Tỉnh/Thành phố", name: "city", value: address.city || "" },
                { label: "Quận/Huyện", name: "district", value: address.district || "" },
                { label: "Xã/Phường", name: "ward", value: address.ward || "" },
                { label: "Địa chỉ cụ thể", name: "address", value: address.address || "" },
            ]);
        } else {
            addresses.push(addressTemplate());
        }
    
        function saveCurrentValues() {
            $(".address-book").each(function () {
                const index = $(this).index();
    
                $(this).find("input").each(function () {
                    const fieldName = $(this).data("name");
    
                    if (addresses[index]) {
                        const addressObj = addresses[index].find((item) => item.name === fieldName);
                        if (addressObj) {
                            addressObj.value = $(this).val();
                        }
                    }
                });
            });
        }
    
        function Html(address, index) {
            return `<div class="address-book mb-4 border-bottom border-primary">
                        <h5 class="title">Địa chỉ ${index + 1}</h5>
                        ${address
                            .map((item) => `
                                <div class="mb-3">
                                    <label class="form-label">${item.label}</label>
                                    <input type="text" class="form-control" 
                                        name="addresses[${index}][${item.name}]"
                                        data-index="${index}" 
                                        data-name="${item.name}" 
                                        value="${item.value}" 
                                        placeholder="${item.label}">
                                </div>
                            `)
                            .join("")}
                        <button type="button" class="btn btn-danger text-white mb-3 d-flex ms-auto delete_address" data-index="${index}">Xóa địa chỉ này</button>
                    </div>`;
        }
    
        function render() {
            saveCurrentValues();
            addressContainer.html(
                addresses.map((address, index) => Html(address, index)).join("")
            );
    
            $(".address-book").each(function (index) {
                $(this).find("input").attr("data-index", index);
                $(this).find(".delete_address").attr("data-index", index);
            });
    
            $(".delete_address").off("click").on("click", function (e) {
                e.preventDefault();
                saveCurrentValues();
                const index = $(this).data("index");
    
                if (index >= 0 && index < addresses.length) {
                    addresses.splice(index, 1);
                }
    
                if (addresses.length === 0) {
                    addresses.push(addressTemplate());
                }
    
                render();
            });
        }
    
        $("#add_address").off("click").on("click", function (e) {
            e.preventDefault();
            saveCurrentValues();
            addresses.push(addressTemplate());
            render();
        });
    
        render();
    }
    

    function deleteUser() {
        $("#delete-user").on("click", function (e) {
            e.preventDefault;
            const routeDelete = $(this).data("route-delete");

            Swal.fire({
                title: "Xóa tài khoản!",
                text: "Việc xóa tài khoản sẽ ảnh hưởng một số thông tin liên quan. Bạn chắc chắn muốn xóa?",
                icon: "error",
                showCancelButton: true,
                confirmButtonText: "Xóa",
                cancelButtonText: "Hủy",
            }).then((result) => {
                if(result.isConfirmed) {
                    $.ajax({
                        url: routeDelete,
                        method: "DELETE",
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                                "content"
                            ),
                        },
                        success: function (response) {
                            console.log('success');
                            
                            if (response.type === "success") {
                                Swal.fire({
                                    title: "Xóa thành công",
                                    icon: "success",
                                    confirmButtonText: "Đồng ý",
                                }).then(() => {
                                    window.location.href = response.redirect;
                                });
                            }
                        },
                        error: function (error) {
                            console.log(error);
                        },
                    });
                }
            });
        });
    }
});
