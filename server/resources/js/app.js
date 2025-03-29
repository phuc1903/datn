import $ from "jquery"; // Import jQuery trước
window.$ = window.jQuery = $; // Gán jQuery vào global window

import toastr from "toastr";
import "toastr/build/toastr.min.css";

import Swal from "sweetalert2";

import "./bootstrap";
import "laravel-datatables-vite";

import TomSelect from "tom-select";
import "tom-select/dist/css/tom-select.css";

import Chart from "chart.js/auto";

window.Swal = Swal;
window.TomSelect = TomSelect;
window.toastr = toastr;
window.Chart = Chart;

// chose sku in combo
$(document).ready(function() {

    var addedSkuIds = [];
    $('.sku.loadData').each(function() {
        var skuId = $(this).data('sku-id');
        addedSkuIds.push(skuId);
    });

    $('.modal-body .add-sku-combo').each(function() {
        var skuId = $(this).data('sku-id');
        
        if (addedSkuIds.includes(skuId)) {
            $(this).prop('disabled', true).text("Đã thêm");
        }
    });

    $('.add-sku-combo').on('click', function() {
        var skuId = $(this).data('sku-id'); 

        var sku = $(this).closest('.sku'); 
        var skuName = sku.find('.name-sku-combo').text();
        var skuPrice = sku.find('.price-sku-combo').html();
        var skuImage = sku.find('.image-sku-combo').attr('src');
        var variantValues = sku.find('.variant-values').text();

        var skuDiv = `<div class="sku p-3 border-bottom" data-sku-id="${skuId}">
            <div class="d-flex justify-content-between">
                <input hidden name="skus[]" value="${skuId}" />
                <div class="content d-flex">
                    <image class="image-sku-combo" src="${skuImage}" alt="${skuName}" />
                    <div class="ms-2">
                        <p class="name-sku-combo mb-2 line-champ-2 text-dark-custom">${skuName}</p>
                        ${variantValues ? `<span class="badge bg-secondary">${variantValues}</span>` : ''}
                        <span class="price-sku-combo fs-5 d-block mt-2 text-dark-custom">${skuPrice}</span>
                    </div>
                </div>
                <div class="button-warp ms-2">
                    <button class="remove-sku-combo">Xóa</button>
                </div>
            </div>
        </div>`;

        $('#sku-list').append(skuDiv);

        $(this).prop('disabled', true).text('Đã thêm');

        $('#choseSkus').modal('hide');
    });

    $(document).on('click', '.remove-sku-combo', function() {
        var skuId = $(this).closest('.sku').data('sku-id');

        $('.add-sku-combo').each(function() {
            var buttonSkuId = $(this).data('sku-id');
            if (buttonSkuId === skuId) {
                $(this).prop('disabled', false).text('Thêm');
            }
        });

        $(this).closest('.sku').remove();
    });
});

// chose product in blog
$(document).ready(function() {

    var addedProductIds = [];
    $('.product.loadData').each(function() {
        var productId = $(this).data('product-id');
        addedProductIds.push(productId);
    });

    $('.modal-body .add-product-blog').each(function() {
        var productId = $(this).data('product-id');
        
        if (addedProductIds.includes(productId)) {
            $(this).prop('disabled', true).text("Đã thêm");
        }
    });

    $('.add-product-blog').on('click', function() {
        var productId = $(this).data('product-id');

        var product = $(this).closest('.product');
        var productName = product.find('.name-product-blog').text();
        var productDescription = product.find('.description-product-blog').text();
        var productImage = product.find('.image-product-blog').attr('src');

        var productDiv = `<div class="product p-3 border-bottom" data-product-id="${productId}">
                            <input hidden name="products[]" value="${productId}"/>
                            <div class="d-flex justify-content-between">
                                <div class="content d-flex">
                                    <image class="image-product-blog" src="${productImage}" alt="${productName}" />
                                    <div class="ms-2">
                                        <p class="mb-2 line-champ-2 name-product-blog text-dark-custom">${productName}</p>
                                        <span class="description-product-blog line-champ-2 mt-2 text-dark-custom">${productDescription}</span>
                                    </div>
                                </div>
                                <div class="button-warp ms-2">
                                    <button class="remove-product-blog">Xóa</button>
                                </div>
                            </div>
                        </div>`;

        $('#product-list').append(productDiv);

        $(this).prop('disabled', true).text('Đã thêm');

        $('#choseProducts').modal('hide');
    });

    $(document).on('click', '.remove-product-blog', function() {
        var productId = $(this).closest('.product').data('product-id');

        $('.add-product-blog').each(function() {
            var buttonSkuId = $(this).data('product-id'); 
            if (buttonSkuId === productId) {
                $(this).prop('disabled', false).text('Thêm');
            }
        });

        $(this).closest('.product').remove();
    });
});


$(".accordion-header").on("click", function (e) {
    if (this.getAttribute("href") === "#") {
        e.preventDefault();
    }
});

// variants

$(document).ready(function () {
    const routeApi = $("#product-attributes").data("route-api");
    let existingSkus = null;
    let attributes = {};

    function fetchSkus() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: routeApi,
                method: "GET",
                dataType: "json",
                cache: false,
                success: function (data) {
                    resolve(data);
                },
                error: function (error) {
                    reject(error);
                },
            });
        });
    }

    async function loadSkusData() {
        try {
            existingSkus = await fetchSkus();

            if (existingSkus) {
                parseExistingSkus(existingSkus);
                loadExistingAttributes();
                if (Array.isArray(existingSkus[0].variant_values) && existingSkus[0].variant_values.length > 0) {
                    generateVariants();
                }
            }
        } catch (error) {
            // alert(error);
        }
    }

    function parseExistingSkus(skus) {
        attributes = {};

        skus.forEach((sku) => {
            sku.variant_values.forEach((variant) => {
                if (!attributes[variant.variant_id]) {
                    attributes[variant.variant_id] = {
                        value: {
                            price: sku.price || 0,
                            promotion_price: sku.promotion_price || 0,
                            quantity: sku.quantity || 1,
                            image_url: sku.image_url || "",
                        },
                        variant_values: [],
                    };
                }

                let variantValueStr = variant.id.toString();
                if (
                    !attributes[variant.variant_id].variant_values.includes(
                        variantValueStr
                    )
                ) {
                    attributes[variant.variant_id].variant_values.push(
                        variantValueStr
                    );
                }
            });
        });
    }

    loadSkusData();

    function loadExistingAttributes() {
        $("#attribute-list").empty();

        Object.keys(attributes).forEach((attributeId) => {
            let selectedAttribute = $(
                `#product-attributes option[value='${attributeId}']`
            );
            let attributeName = selectedAttribute.text();
            let attributeData = selectedAttribute.data("vari");

            if (attributeData) {
                renderAttributeHtml(attributeId, attributeName, attributeData);
            }
        });
    }

    function addAttribute() {
        let selectedAttribute = $("#product-attributes option:selected");
        let attributeId = selectedAttribute.val();
        let attributeName = selectedAttribute.text();
        let attributeData = selectedAttribute.data("vari");

        if (!attributeId) {
            toastr.info("Vui lòng chọn thuộc tính", "Thông báo");
            return;
        }

        if (attributes[attributeId]) {
            toastr.warning("Thuộc tính này đã được thêm", "Cảnh báo");
            return;
        }

        attributes[attributeId] = {
            value: {
                price: 0,
                promotion_price: 0,
                quantity: 1,
                image_url: "",
            },
            variant_values: [],
        };

        renderAttributeHtml(attributeId, attributeName, attributeData);
    }

    function renderAttributeHtml(attributeId, attributeName, attributeData) {
        let selectId = `attribute-values-${attributeId}`;
        let selectedVariantValues =
            attributes[attributeId]?.variant_values || [];

        let variantOptions = attributeData.values
            .map(
                (value) =>
                    `<option value="${value.id}" ${
                        selectedVariantValues.includes(value.id.toString())
                            ? "selected"
                            : ""
                    }>${value.value}</option>`
            )
            .join("");

        let newAttribute = `
            <div class="accordion-item" id="attribute-${attributeId}">
                <h2 class="accordion-header" id="heading-${attributeId}">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse"
                        data-bs-target="#collapse-${attributeId}" aria-expanded="true"
                        aria-controls="collapse-${attributeId}">
                        ${attributeName}
                    </button>
                </h2>
                <div id="collapse-${attributeId}" class="accordion-collapse collapse"
                    aria-labelledby="heading-${attributeId}" data-bs-parent="#attribute-list">
                    <div class="accordion-body">
                        <span class="text-dark-custom px-3 py-1">Chọn biến thể</span>
                        <select class="form-select attribute-values" id="${selectId}" multiple>
                            ${variantOptions}
                        </select>
                        <button type="button" class="btn btn-danger remove-attribute mt-2" data-attribute-id="${attributeId}">Xóa thuộc tính này</button>
                    </div>
                </div>
            </div>`;

        $("#attribute-list").append(newAttribute);

        let $select = $(`#${selectId}`);
        if ($select.length > 0) {
            let tomSelectInstance = new TomSelect(`#${selectId}`, {
                plugins: ["remove_button"],
                persist: false,
                createOnBlur: true,
                create: false,
                sortField: { field: "text" },
            });

            $select.data("tomselectInstance", tomSelectInstance);
        }
    }

    function saveAttributes() {
        $(".attribute-values").each(function () {
            let attributeId = $(this)
                .attr("id")
                ?.replace("attribute-values-", "");
            let tomSelectInstance = $(this).data("tomselectInstance");

            if (tomSelectInstance) {
                let selectedValues = tomSelectInstance.getValue();
                attributes[attributeId].variant_values = selectedValues;
            }
        });

        toastr.success("Lưu thuộc tính thành công!", "Thành công");
    }

    function generateVariants() {
        $("#variant-list").empty();

        let attributeValues = Object.values(attributes).map(
            (attr) => attr.variant_values
        );

        if (
            attributeValues.length === 0 ||
            attributeValues.every((val) => val.length === 0)
        ) {
            toastr.error("Bạn cần chọn ít nhất 1 biến thể!", "Lỗi");
            return;
        }

        let combinations = generateCombinations(attributeValues);
        let variantHtml = "";

        combinations.forEach((variant, index) => {
            let variantLabels = variant.map((valueId) => {
                let attributeId = Object.keys(attributes).find((id) =>
                    attributes[id].variant_values.includes(valueId)
                );
                return $(
                    `#attribute-values-${attributeId} option[value='${valueId}']`
                ).text();
            });

            let existingData = existingSkus?.find((sku) => {
                let skuVariantIds = sku.variant_values.map((v) =>
                    v.id.toString()
                );
                return (
                    JSON.stringify(skuVariantIds.sort()) ===
                    JSON.stringify(variant.sort())
                );
            });

            let price = existingData ? existingData.price : 0;
            let promotion_price = existingData
                ? existingData.promotion_price
                : 0;
            let quantity = existingData ? existingData.quantity : 1;
            let image_url = existingData ? existingData.image_url : "";

            let hiddenInputs = `
                <input type="hidden" class="hidden-price" name="variants[${index}][price]" value="${price}">
                <input type="hidden" class="hidden-promotion-price" name="variants[${index}][promotion_price]" value="${promotion_price}">
                <input type="hidden" class="hidden-quantity" name="variants[${index}][quantity]" value="${quantity}">
                <input type="hidden" class="hidden-image-url" name="variants[${index}][image_url]" value="${image_url}">
            `;

            variant.forEach((value, idx) => {
                hiddenInputs += `<input type="hidden" name="variants[${index}][variant_values][${idx}]" value="${value}">`;
            });

            let variantInputs = `
                <div class="accordion-item" id="variant-${index}">
                    <h2 class="accordion-header" id="heading-${index}">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                data-bs-target="#collapse-${index}" aria-expanded="false" aria-controls="collapse-${index}">
                            ${variantLabels.join(" - ")}
                        </button>
                    </h2>
                    <div id="collapse-${index}" class="accordion-collapse collapse" aria-labelledby="heading-${index}" data-bs-parent="#variant-list">
                        <div class="accordion-body d-flex gap-3">
                          <div class="mb-3">
                                <img id="preview-image-${index}" src="${
                image_url ? image_url : "#"
            }" alt="Ảnh biến thể" style="max-width: 100px; ${
                image_url ? "display: block;" : "display: none;"
            }"/>
                                <label class="form-label text-dark-custom">Hình ảnh biến thể</label>
                                <input type="file" class="form-control variant-image" name="variants[${index}][image]" id="variant-image-${index}"  style="max-width: 100px;">
                            </div>
                            <div class="w-100"> 
                                <div class="mb-3">
                                    <label class="form-label text-dark-custom">Giá bán (đ)</label>
                                    <input class="form-control variant-price numeric" data-index="${index}" value="${price}" min="0" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label text-dark-custom">Giá khuyến mãi (đ)</label>
                                    <input class="form-control variant-promotion-price numeric" data-index="${index}" value="${promotion_price}" min="0">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label text-dark-custom">Số lượng</label>
                                    <input class="form-control variant-quantity numeric" type="number" data-index="${index}" value="${quantity}" min="1" required>
                                </div>   
                                <button type="button" class="btn btn-danger remove-variant" data-variant-index="${index}">Xóa biến thể này</button>
                            </div>
                        </div>
                    </div>
                    ${hiddenInputs}
                </div>`;

            variantHtml += variantInputs;
        });

        $("#variant-list").html(variantHtml);

        $(".variant-price, .variant-promotion-price, .variant-quantity").on(
            "input",
            function () {
                let index = $(this).data("index");
                let price = $(`.variant-price[data-index="${index}"]`).val();
                let promotion_price = $(
                    `.variant-promotion-price[data-index="${index}"]`
                ).val();
                let quantity = $(
                    `.variant-quantity[data-index="${index}"]`
                ).val();

                $(`.hidden-price[name="variants[${index}][price]"]`).val(price);
                $(
                    `.hidden-promotion-price[name="variants[${index}][promotion_price]"]`
                ).val(promotion_price);
                $(`.hidden-quantity[name="variants[${index}][quantity]"]`).val(
                    quantity
                );
            }
        );

        $(".variant-image").change(function (event) {
            let index = $(this).attr("id").split("-").pop();
            let file = event.target.files[0];

            if (file) {
                let reader = new FileReader();
                reader.onload = function (e) {
                    $(`#preview-image-${index}`)
                        .attr("src", e.target.result)
                        .show();
                    $(`#variant-image-${index}`).attr(
                        "data-image-url",
                        e.target.result
                    );
                    $(
                        `.hidden-image-url[name="variants[${index}][image_url]"]`
                    ).val(e.target.result);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    function generateCombinations(arrays) {
        return arrays.reduce(
            (acc, curr) => acc.flatMap((a) => curr.map((b) => [].concat(a, b))),
            [[]]
        );
    }

    $("#generate-variants").click(generateVariants);
    $("#add-attribute").click(addAttribute);
    $("#save-attributes").click(saveAttributes);

    $(document).on("click", ".remove-attribute", function () {
        let attributeId = $(this).data("attribute-id");
        let attributeElement = $(`#attribute-${attributeId}`);

        Swal.fire({
            title: "Xóa thộc tính",
            text: "Bạn chắc chắn muốn xóa thuộc tính này?",
            icon: "error",
            showCancelButton: true,
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
        }).then((result) => {
            if (result.isConfirmed) {
                attributeElement.remove();
                delete attributes[attributeId];
                generateVariants();
                toastr.success("Xóa thuộc tính thành công!", "Thành công");
            }
        });
    });

    $(document).on("click", ".remove-variant", function () {
        let variantIndex = $(this).data("variant-index");
        let variantElement = $(`#variant-${variantIndex}`);

        Swal.fire({
            title: "Xóa biến thể",
            text: "Bạn chắc chắn muốn xóa biến thể này ?",
            icon: "error",
            showCancelButton: true,
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
        }).then((result) => {
            if (result.isConfirmed) {
                variantElement.remove();
                toastr.success("Xóa biến thể thành công!", "Thành công");
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const productTypeSelect = document.getElementById("product-type");
    const simpleProductDiv = document.getElementById("simple-product");
    const variableProductDiv = document.getElementById("variable-product");

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
    deleteItem();
    addVariantValue();
    formatPriceMain();
    addSlug();
    selectedModules();
    checkSkusCombo();
    checkQuantity();
    uploadThumbnailProduct();

    function addSlug() {
        function createSlug(str) {
            return str
                .toLowerCase()
                .replace(/á|à|ả|ã|ạ|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ|ä|æ/g, 'a')
                .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ|ë/g, 'e')
                .replace(/i|í|ì|ỉ|ĩ|ị|ï/g, 'i')
                .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ|ö/g, 'o')
                .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự|ü/g, 'u')
                .replace(/ý|ỳ|ỷ|ỹ|ỵ|ÿ/g, 'y')
                .replace(/đ/g, 'd')
                .replace(/[^a-z0-9\- ]/g, '') 
                .replace(/ +/g, '-') 
                .replace(/--+/g, '-')
                .replace(/^-+|-+$/g, '');
        }

        $('#name').on('keyup', function () {
            const valueName = $(this).val();
            const slug = createSlug(valueName);
            $('#slug').val(slug);
        });
    }

    function formatPriceMain() {
        function formatPrice(number) {
            number = number.replace(/\D/g, "");
            return new Intl.NumberFormat("vi-VN").format(number) + " VNĐ";
        }

        function formatPercent(number) {
            number = number.replace(/\D/g, "");
            return number + " %";
        }

        var type = $("#type").val();
        var discountField = $('input[name="discount_value"]');

        if (type !== "percent") {
            $('#max_discount_value').hide();
            $('#max_discount_value').find('.value').val(null);
        } else {
            $('#max_discount_value').show();
        }

        $("#type").change(function () {
            var type = $(this).val();

            discountField.val(0);

            if (type == "percent") {
                discountField.removeClass("price").addClass("percent");
                discountField.val(discountField.val().replace("VNĐ", ""));

                $('#max_discount_value').show();
            } else {
                discountField.removeClass("percent").addClass("price");
                discountField.val(discountField.val().replace("%", ""));

                $('#max_discount_value').hide();
                $('#max_discount_value').find('.value').val(null);
            }
        });
        

        $(".price").on("keyup", function () {
            let input = $(this).val();
            $(this).val(formatPrice(input));
        });

        $('.price').each(function () {
            let input = $(this).val();
            if (input) {
                $(this).val(formatPrice(input));
            }
        })

        $('.percent').each(function () {
            let input = $(this).val();
            if (input) {
                $(this).val(formatPercent(input));
            }
        })

        $('input[name="discount_value"]').on("keyup", function () {
            var input = $(this).val();
            if ($(this).hasClass("price")) {
                $(this).val(formatPrice(input));
            }
            if ($(this).hasClass("percent")) {
                $(this).val(formatPercent(input));
            }
        });

        $("form").on("submit", function () {
            $(".price").each(function () {
                let rawPrice = $(this).val().replace(/\D/g, "");
                $(this).val(rawPrice);
            });
            $(".percent").each(function () {
                let rawPercent = $(this).val().replace("%", "");
                $(this).val(rawPercent);
            });
        });
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
                        error: function (error) {},
                    });
                }
            });
        });
    }

    function deleteItem() {
        $(document).on("click", ".deleteItem", function (e) {
            e.preventDefault();

            const button = $(this);
            const routeDelete = $(this).data("route-delete");
            const idTable = $(this).data("id-table");

            Swal.fire({
                title: "Xóa dữ liệu",
                text: "Hành động này sẽ xóa các dữ liệu liên quan. Bạn chắc chắn muốn xóa?",
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
                            if (response.type === "success") {
                                let table = $("#" + idTable).DataTable();
                                let row = button.closest("tr");
                                table.row(row).remove().draw(false);
                                Swal.fire({
                                    title: "Xóa thành công",
                                    icon: "success",
                                    confirmButtonText: "Đồng ý",
                                });
                            }
                        },
                        error: function (error) {},
                    });
                }
            });
        });
    }

    function addVariantValue() {
        const variantContainer = $("#VariantValue");
        const routeApi = variantContainer.data("route");
        let variantsDatabase = [];

        const variantTemplate = () => ({
            value: "",
            name: "value",
        });

        function getVariants(variantsDatabase) {
            return Array.isArray(variantsDatabase) &&
                variantsDatabase.length > 0
                ? variantsDatabase.map((variant) => ({
                      name: "value",
                      value: variant.value || "",
                  }))
                : [variantTemplate()];
        }

        let variants = [];

        $.ajax({
            url: routeApi,
            method: "GET",
            dataType: "json",
            cache: false,
            success: function (data) {
                variantsDatabase = data["values"] || [];

                variants = getVariants(variantsDatabase);

                render();
            },
            error: function (error) {},
        });

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
                            <label class="form-label">Tên biến thể</label>
                            <input type="text" class="form-control" 
                                name="variants[${index}][${variant.name}]" 
                                data-index="${index}" 
                                data-name="${variant.name}" 
                                value="${variant.value}" 
                                placeholder="Tên biến thể">
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
    }

    function selectedModules() {
        $('.form-check-input[id^="module-"]').on('change', function() {
            let moduleId = $(this).val();
            let isChecked = $(this).prop('checked'); 

            $('.module-' + moduleId).prop('checked', isChecked);
        });

        $('.form-check-input[name="permissions[]"]').on('change', function() {
            let moduleId = $(this).attr('class').match(/module-(\d+)/)[1];
            let allPermissions = $('.module-' + moduleId); 
            let allChecked = allPermissions.length === allPermissions.filter(':checked').length; 

            $('#module-' + moduleId).prop('checked', allChecked);
        });
    }

    function checkSkusCombo() {
        $('.sku-combo').on("click", function (e) {
            if ($(e.target).is(".check-skus")) {
                return;
            }
    
            var checkbox = $(this).find(".check-skus");


            checkbox.prop("checked", !checkbox.prop("checked"));

            var parentProductBlog = $(e.target).closest('.product-blog');
            if (parentProductBlog.length) {
                if (checkbox.prop("checked")) {
                    parentProductBlog.addClass('active');
                } else {
                    parentProductBlog.removeClass('active');
                }
            }
        });
    }

    function checkQuantity() {
        $(document).on('keypress', '.numeric', function (e) {
            let charCode = e.which ? e.which : e.keyCode;
            if (charCode < 48 || charCode > 57) {
                e.preventDefault();
            }
        });
    
        $(document).on('blur change', '.numeric', function () {
            let val = parseInt($(this).val().toString().trim());
    
            if (isNaN(val) || val < 1) {
                $(this).val(1);
            }
        });
    }


    function uploadThumbnailProduct() {
        $(document).on('click', '.close-btn', function() {
            $(this).closest('.image-container').remove();
        });
        
        function imagePreview(name) {
            return `
                <div class="col image-container" id="image-${name}">
                    <input type="file" id="upload-${name}" name="thumbnails[]" hidden />
                    <img class="w-100 h-100" id="preview-${name}" src="" alt="Image Preview" />
                    <button type="button" class="close-btn"><i class="bi bi-x"></i></button>
                </div>
            `;
        }
    
        $("#uploadThumbnaiProduct").on('click', function() {
            const name = new Date().getTime();
            
            $("#thumbnails").append(imagePreview(name));
            
            const fileInput = $(`#upload-${name}`);
            
            fileInput[0].click();
            
            fileInput.on('change', function(event) {
                const file = event.target.files[0];
                const reader = new FileReader();
            
                reader.onload = function(e) {
                    $(`#preview-${name}`).attr("src", e.target.result);
                };
            
                if (file) {
                    reader.readAsDataURL(file);
                }
            });
        });
    }
    
    
    
});
