
<div class="selectLocation">
    <h5 class="mb-3">Lọc theo địa chỉ</h5>
    <div class="mb-3 d-block d-md-flex gap-3">
        <select id="provinces" class="form-select mb-3">
            <option value="" selected>Chọn Tỉnh/Thành Phố</option>
        </select>
        <select id="districts" class="form-select mb-3" disabled>
            <option value="" selected>Vui lòng chọn Tỉnh/Thành Phố</option>
        </select>
        <select id="wards" class="form-select mb-3" disabled>
            <option value="" selected>Vui lòng chọn Quận/Huyện</option>
        </select>
    </div>
</div>


@push('scripts')
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            function fetchData(url, callback) {
                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        callback(data.data);
                    })
                    .catch(error => {
                        callback([]);
                    });
            }

            let provinceSelect = new TomSelect("#provinces", {
                valueField: "code",
                labelField: "name",
                searchField: "name",
                create: false,
                persist: false,
                maxItems: 1,
                load: function(query, callback) {
                    fetchData("{{ route('admin.provinces') }}", callback);
                },
                onFocus: function() {
                    this.load("");
                },
            });

            let districtSelect = new TomSelect("#districts", {
                valueField: "code",
                labelField: "name",
                searchField: "name",
                create: false,
                persist: false,
                maxItems: 1,
                load: function(query, callback) {
                    let provinceCode = document.querySelector("#provinces").value;
                    if (!provinceCode) return callback([]);
                    fetchData("{{ route('admin.districts') }}?province_code=" + provinceCode, callback);
                },
                onFocus: function() {
                    this.load("");
                },
            });

            let wardSelect = new TomSelect("#wards", {
                valueField: "code",
                labelField: "name",
                searchField: "name",
                create: false,
                persist: false,
                maxItems: 1,
                load: function(query, callback) {
                    let districtCode = document.querySelector("#districts").value;
                    if (!districtCode) return callback([]);
                    fetchData("{{ route('admin.wards') }}?district_code=" + districtCode, callback);
                },
                onFocus: function() {
                    this.load("");
                },
            });

            provinceSelect.on("change", function(value) {
                districtSelect.clear();
                districtSelect.clearOptions();
                districtSelect.enable();
                districtSelect.load("");

                wardSelect.clear();
                wardSelect.clearOptions();
                wardSelect.disable();
            });

            districtSelect.on("change", function(value) {
                wardSelect.clear();
                wardSelect.clearOptions();
                wardSelect.enable();
                wardSelect.load("");
            });
        });
    </script>
@endpush
