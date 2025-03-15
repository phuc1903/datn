

<script>
    $(document).ready(function() {
        const addressContainer = $("{{ $Container }}");


        let addresses = [];

        function saveCurrentValues() {
            $(".address-book").each(function() {
                const index = $(this).index();

                $(this)
                    .find("input")
                    .each(function() {
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

            $(".address-book").each(function(index) {
                $(this).find("input").attr("data-index", index);
                $(this).find(".delete_address").attr("data-index", index);
            });

            $(".delete_address")
                .off("click")
                .on("click", function(e) {
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
            .on("click", function(e) {
                e.preventDefault();
                saveCurrentValues();
                addresses.push(addressTemplate());
                render();
            });

        render();
    })
</script>
