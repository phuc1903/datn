@props(['src' => config('settings.image_default'), 'alt' => '', 'rounded' => false, 'class' => ''])

<img @class(["image rounded img-fluid", 'rounded-circle' => $rounded, $class]) {{ $attributes }} src="{{ $src}}" alt="{{ $alt}}"/>