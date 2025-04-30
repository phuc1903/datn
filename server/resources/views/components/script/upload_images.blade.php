<script>
    function chooseImage(idPreview) {
        var fileInputId = 'file-' + idPreview; 
        document.getElementById(fileInputId).click(); 
    }

    function previewImage(input, idPreview) {
        var file = input.files[0];

        if (file) {
            var reader = new FileReader();

            reader.onload = function(e) {
                document.getElementById(idPreview).src = e.target.result;
            }

            reader.readAsDataURL(file);
        } else {
            document.getElementById(idPreview).src = "{{ config('settings.image_default') }}";
        }
    }
</script>
