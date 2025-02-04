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
