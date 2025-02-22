import $ from "jquery";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

import Swal from "sweetalert2";

import "./bootstrap";
import "laravel-datatables-vite";

window.Swal = Swal;
window.$ = window.jQuery = $;
window.toastr = toastr;

// Change theme mode
document.addEventListener("DOMContentLoaded", function () {
    const toggleThemeBtn = document.getElementById("toggle-theme");

    let currentTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", currentTheme);

    toggleThemeBtn.addEventListener("click", function () {
        let newTheme =
            document.documentElement.getAttribute("data-theme") === "light"
                ? "dark"
                : "light";

        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);

        // Gửi AJAX request lên server để lưu trạng thái
        fetch("/save-theme", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": document.querySelector(
                    'meta[name="csrf-token"]'
                ).content,
            },
            body: JSON.stringify({ theme: newTheme }),
        })
            .then((response) => response.json())
            .catch((error) => console.error("Error saving theme:", error));
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const productTypeSelect = document.getElementById("product-type");
    const simpleProductDiv = document.getElementById("simple-product");
    const variableProductDiv = document.getElementById("variable-product");

    // Xử lý khi chọn loại sản phẩm
    productTypeSelect.addEventListener("change", function () {
        if (this.value === "simple") {
            simpleProductDiv.style.display = "flex";
            variableProductDiv.style.display = "none";
        } else {
            simpleProductDiv.style.display = "none";
            variableProductDiv.style.display = "block";
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const currency = "VND";
    const priceInputs = document.querySelectorAll('input[data-format="price"]');
    priceInputs.forEach(function (priceInput) {
        const hiddenInputId = priceInput.id + "-hidden";
        const hiddenInput = document.getElementById(hiddenInputId);
        if (!hiddenInput) {
            console.error("Hidden input not found for ID:", hiddenInputId);
            return;
        }

        let initialValue = priceInput.value.replace(/\D/g, "");
        hiddenInput.value = initialValue;
        priceInput.value = numeral(initialValue).format("0,0") + " " + currency;

        priceInput.addEventListener("input", function () {
            const rawValue = this.value.replace(/\D/g, "");
            this.value = numeral(rawValue).format("0,0");
            hiddenInput.value = rawValue;
        });

        priceInput.addEventListener("focus", function () {
            this.value = this.value.replace(/ VND$/, "");
        });

        priceInput.addEventListener("blur", function () {
            const currentRawValue = this.value.replace(/\D/g, "");
            this.value =
                numeral(currentRawValue).format("0,0") + " " + currency;
            hiddenInput.value = currentRawValue;
        });
    });
});

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


$(document).ready(function () {
    
    addAddress();
    deleteUser();
    addVariantValue();
    addProductOrder();
    choseAttribute();

    function choseAttribute() {
        let selectedAttributes = [1,2,3,4,5];
        const getAttribute = document.getElementById("getAttributes");
        const buttonGetAttribute = document.getElementById("addAttribute");
        const attributeList = document.getElementById("attributeList");


        
    }

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
                {
                    label: "Tỉnh/Thành phố",
                    name: "city",
                    value: address.city || "",
                },
                {
                    label: "Quận/Huyện",
                    name: "district",
                    value: address.district || "",
                },
                { label: "Xã/Phường", name: "ward", value: address.ward || "" },
                {
                    label: "Địa chỉ cụ thể",
                    name: "address",
                    value: address.address || "",
                },
            ]);
        } else {
            addresses.push(addressTemplate());
        }

        function saveCurrentValues() {
            $(".address-book").each(function () {
                const index = $(this).index();

                $(this)
                    .find("input")
                    .each(function () {
                        const fieldName = $(this).data("name");

                        if (addresses[index]) {
                            const addressObj = addresses[index].find(
                                (item) => item.name === fieldName
                            );
                            if (addressObj) {
                                addressObj.value = $(this).val();
                            }
                        }
                    });
            });
        }

        function Html(address, index) {
            return `<div class="address-book mb-4 border-bottom border-primary" data-index="${index}">
                        <h5 class="title">Địa chỉ ${index + 1}</h5>
                        ${address
                            .map(
                                (item) => `
                                <div class="mb-3">
                                    <label class="form-label">${item.label}</label>
                                    <input type="text" class="form-control" 
                                        name="addresses[${index}][${item.name}]"
                                        data-index="${index}" 
                                        data-name="${item.name}" 
                                        value="${item.value}" 
                                        placeholder="${item.label}">
                                </div>
                            `
                            )
                            .join("")}
                        <button type="button" class="btn btn-danger text-white mb-3 d-flex ms-auto delete_address" data-index="${index}">Xóa địa chỉ này</button>
                    </div>`;
        }

        function render() {
            // saveCurrentValues();
            addressContainer.html(
                addresses.map((address, index) => Html(address, index)).join("")
            );

            $(".address-book").each(function (index) {
                $(this).find("input").attr("data-index", index);
                $(this).find(".delete_address").attr("data-index", index);
            });

            $(".delete_address")
                .off("click")
                .on("click", function (e) {
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

        $("#add_address")
            .off("click")
            .on("click", function (e) {
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
                if (result.isConfirmed) {
                    $.ajax({
                        url: routeDelete,
                        method: "DELETE",
                        headers: {
                            "X-Requested-With": "XMLHttpRequest",
                            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                                "content"
                            ),
                        },
                        success: function (response) {
                            console.log("success");

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

    function addVariantValue() {
        const variantContainer = $("#VariantValue");
        const variantsDatabase = variantContainer.data("variants") || [];

        const variantTemplate = () => ({
            label: "Tên biến thể",
            value: "",
            name: "value",
        });

        let variants =
            Array.isArray(variantsDatabase) && variantsDatabase.length > 0
                ? variantsDatabase.map((variant) => ({
                      name: "value",
                      value: variant.value || "",
                  }))
                : [variantTemplate()];

        function saveCurrentValues() {
            $(".variant").each(function () {
                const index = $(this).data("index");

                $(this)
                    .find("input")
                    .each(function () {
                        const fieldName = $(this).data("name");
                        if (variants[index]) {
                            variants[index][fieldName] = $(this).val();
                        }
                    });
            });
        }

        function Html(variant, index) {
            return `<div class="variant mb-4 border-bottom border-primary" data-index="${index}">
                        <h5 class="title">Biến thể ${index + 1}</h5>
                        <div class="mb-3">
                            <label class="form-label">${variant.label}</label>
                            <input type="text" class="form-control" 
                                name="variants[${index}][${variant.name}]" 
                                data-index="${index}" 
                                data-name="${variant.name}" 
                                value="${variant.value}" 
                                placeholder="${variant.label}">
                        </div>
                        <button type="button" class="btn btn-danger text-white mb-3 d-flex ms-auto delete_value" data-index="${index}">Xóa biến thể này</button>
                    </div>`;
        }

        function render() {
            $("#VariantValue").html(
                variants.map((variant, index) => Html(variant, index)).join("")
            );

            $("#VariantValue .variant").each(function (newIndex) {
                $(this).attr("data-index", newIndex);
                $(this).find(".delete_value").attr("data-index", newIndex);
            });

            $(".delete_value")
                .off("click")
                .on("click", function (e) {
                    e.preventDefault();

                    saveCurrentValues();

                    const index = $(this).data("index");

                    if (index >= 0 && index < variants.length) {
                        variants.splice(index, 1);
                    }

                    if (variants.length === 0) {
                        variants.push(variantTemplate());
                    }

                    render();
                });
        }

        $("#add_variant_value")
            .off("click")
            .on("click", function (e) {
                e.preventDefault();
                saveCurrentValues();
                variants.push(variantTemplate());
                render();
            });

        render();
    }

    function addProductOrder() {
        const buttonAdd = $("#add-product-order");
    }


    
    
});
