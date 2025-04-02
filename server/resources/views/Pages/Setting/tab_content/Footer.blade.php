<div class="tab-pane fade" id="{{ $id }}-pane" role="tabpanel" aria-labelledby="{{ $id }}-tab" tabindex="0">
    <div class="row row-cols-md-2 row-cols-1">
        <div class="col mb-4">
            <div class="bg-white-custom p-4 card-setting">
                <h4 class="title text-dark-custom mb-4">
                    Địa chỉ
                </h4>
                <div class="body">
                    <form action="{{ route('admin.setting.store')}}" method="post" enctype="multipart/form-data">
                        @csrf
                        @php
                            $address = $settings->get('FooterAddresses') ?? [];
                            $defaultCount = max(4, count($address));

                            for ($i = count($address); $i < $defaultCount; $i++) {
                                $address[] = ['name' => '', 'value' => ''];
                            }
                        @endphp

                        @for($i = 0; $i < $defaultCount; $i++)
                            <div class="item mb-4">
                                <h5 class="text-dark-custom mb-3">Địa chỉ {{ $i + 1 }}</h5>
                                <div class="row row-cols-2">
                                    <div class="col">
                                        <x-form.input_text label="Tên địa chỉ {{ $i + 1 }}"
                                            name="FooterAddresses[{{ $i }}][name]"
                                            value="{{ $address[$i]['name'] ?? '' }}" />
                                    </div>
                                    <div class="col">
                                        <x-form.input_text label="Địa chỉ {{ $i + 1 }}"
                                            name="FooterAddresses[{{ $i }}][value]"
                                            value="{{ $address[$i]['value'] ?? '' }}" />
                                    </div>
                                </div>
                            </div>
                        @endfor
                        <x-button type="submit" label="Cập nhật" style="margin-left: auto" />
                    </form>
                </div>
            </div>
        </div>
        <div class="col mb-4">
            <div class="bg-white-custom p-4 card-setting">
                <h4 class="title text-dark-custom mb-4">
                    Một số nội dung
                </h4>
                <div class="body">
                    <form action="{{ route('admin.setting.store')}}" method="post" enctype="multipart/form-data">
                        @csrf
                        <div class="item mb-4">
                            <x-form.input_text label="Giờ mở cửa" name="FooterHouseOpen"
                                value="{{ isset($settings['FooterHouseOpen']) ? $settings['FooterHouseOpen'] : '' }}" />
                            <x-form.input_text label="Góp ý khiếu nại" name="FooterComplaints"
                                value="{{ isset($settings['FooterComplaints']) ? $settings['FooterComplaints'] : '' }}" />
                            <x-form.input_text label="Slogan" name="FooterSlogan"
                                value="{{ isset($settings['FooterSlogan']) ? $settings['FooterSlogan'] : '' }}" />
                        </div>
                        <x-button type="submit" label="Cập nhật" style="margin-left: auto" />
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>