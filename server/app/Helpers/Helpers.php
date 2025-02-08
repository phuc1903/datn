<?php

if (!function_exists('ResponseError')) {
    function ResponseError($message, $errors = null, $httpCode = 400)
    {
        return response()->json([
            'status' => 'error',
            'message' => $message,
            'errors' => $errors
        ], $httpCode);
    }
}

if (!function_exists('ResponseSuccess')) {
    function ResponseSuccess($message, $data = null, $httpCode = 200)
    {
        return response()->json([
            'status' => 'success',
            'message' => $message,
            'data' => $data
        ], $httpCode);
    }
}

// Kiểm tra cấu hình Mail có đầy đủ không
if (!function_exists('hasCompleteMailConfig')) {
    function hasCompleteMailConfig()
    {
        // Truy cập config của mail
        $mailConfig = config('mail.mailers.smtp');
        if (
            empty($mailConfig['username']) ||
            empty($mailConfig['password']) ||
            empty($mailConfig['port']) ||
            empty($mailConfig['host']) ||
            empty($mailConfig['username'])
        ) {
            return false; // Nếu thiếu cấu hình
        }

        return true; // Cấu hình đầy đủ
    }
}
