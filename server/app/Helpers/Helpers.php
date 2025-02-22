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
    function mapEnumToArray(string $enumClass, string $currentValue = null): array
    {
        if (!method_exists($enumClass, 'getValues') || !method_exists($enumClass, 'fromValue')) {
            throw new InvalidArgumentException("$enumClass không phải là một Enum hợp lệ");
        }

        if (!isset($currentValue)) {
            return array_map(function ($value) use ($enumClass) {
                $enumInstance = $enumClass::fromValue($value);
                return [
                    'label' => $enumInstance->label(),
                    'value' => $enumInstance->value,
                ];
            }, $enumClass::getValues());
        }
        return collect($enumClass::getValues())
            ->when($currentValue, function ($collection, $currentValue) {
                return $collection->filter(fn($value) => $value !== $currentValue); // Loại bỏ giá trị hiện tại nếu có
            })
            ->map(fn($value) => [
                'label' => $enumClass::fromValue($value)->label(),
                'value' => $value,
            ])
            ->values()
            ->toArray();
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
