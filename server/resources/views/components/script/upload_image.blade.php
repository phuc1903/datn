<script>
    function chooseImage() {
        document.getElementById('typeFile').click();
    }

    function previewImage(input) {
        var file = input.files[0];

        if (file) {
            var reader = new FileReader();

            reader.onload = function(e) {
                document.getElementById('imagePreview').src = e.target.result;
            }

            reader.readAsDataURL(file);
        } else {
            document.getElementById('imagePreview').src = "{{ config('settings.image_default') }}";
        }
    }
</script>