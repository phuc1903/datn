<?php
return [
    'requestType' => env('MOMO_REQUEST_TYPE', 'payWithCC'),
    'partner_code' => env('MOMO_PARTNER_CODE', 'MOMO'),
    'access_key' => env('MOMO_ACCESS_KEY', 'F8BBA842ECF85'),
    'secret_key' => env('MOMO_SECRET_KEY', 'K951B6PE1waDMi640xX08PD3vg6EkVlz'),
    'endpoint' => env('MOMO_ENDPOINT', 'https://test-payment.momo.vn/v2/gateway/api/create'),
    'ipn_url' => env('MOMO_IPN_URL'),
    'redirect_url' => env('MOMO_REDIRECT_URL'),
];
