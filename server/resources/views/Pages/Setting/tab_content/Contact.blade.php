<div class="tab-pane fade" id="{{ $id }}-pane" role="tabpanel" aria-labelledby="{{ $id }}-tab" tabindex="0">
    <div class="row row-cols-md-2 row-cols-1">
        <div class="col mb-4">
            <div class="bg-white-custom p-4 card-setting">
                <h4 class="title text-dark-custom mb-4">
                    Trang liên hệ
                </h4>
                <div class="body">
                    <form action="{{ route('admin.setting.store')}}" method="post" enctype="multipart/form-data">
                        @csrf
                        <div class="item mb-4">
                            <x-form.input_text label="Địa chỉ" name="Contact[Address]"
                                value="{{ isset($settings['Contact']['Address']) ? $settings['Contact']['Address'] : '' }}" />
                        </div>
                        <div class="item mb-4">
                            <x-form.input_text label="Số điện thoại" name="Contact[Phone]"
                                value="{{ isset($settings['Contact']['Phone']) ? $settings['Contact']['Phone'] : '' }}" />
                        </div>
                        <div class="item mb-4">
                            <x-form.input_text label="Email" name="Contact[Email]"
                                value="{{ isset($settings['Contact']['Email']) ? $settings['Contact']['Email'] : '' }}" />
                        </div>
                        <x-button type="submit" label="Cập nhật" style="margin-left: auto" />
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
