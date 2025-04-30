<div class="tab-pane fade" id="{{ $id }}-pane" role="tabpanel" aria-labelledby="{{ $id }}-tab" tabindex="0">
    <div class="row row-cols-1">
        <div class="col mb-4">
            <form action="{{ route('admin.setting.store')}}" method="post" enctype="multipart/form-data">
                <div class="bg-white-custom p-4 card-setting">
                    <div class="d-flex justify-content-between mb-4">
                        <h4 class="title text-dark-custom">
                            Nội dung
                        </h4>
                        <x-button type="submit" label="Cập nhật" style="margin-left: auto" />
                    </div>
                    <div class="body">
                        @csrf
                        <textarea id="description" class="input-text-custom" name="About">{{ isset($settings['About']) ? $settings['About'] : '' }}</textarea>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>

@push('libs-js')
    <script src="{{ asset('ckeditor/ckeditor.js') }}"></script>
@endpush

@push('scripts')
    <script>
        CKEDITOR.replace('description', {
            language: 'vi',
            height: 700
        });
    </script>
@endpush