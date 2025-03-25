<?php

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

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

if (!function_exists('flattenCategories')) {
    function flattenCategories($categories, $parentId = 0, $depth = 0)
    {
        $flattened = [];

        foreach ($categories as $category) {
            if ($category->parent_id == $parentId) {
                $category->depth = $depth;
                $flattened[] = $category;

                $flattened = array_merge($flattened, flattenCategories($categories, $category->id, $depth + 1));
            }
        }

        return $flattened;
    }
}

if (!function_exists('mapEnumToArray')) {
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

if (!function_exists('checkDataUpdate')) {
    function checkDataUpdate(array $newData, array $oldData)
    {
        $check = empty(array_diff_assoc($newData, $oldData));
        return $check;
    }
}

if (!function_exists('deleteImage')) {
    function deleteImage($image = null)
    {
        if (!$image) {
            return false;
        }

        $checkImageStorage = Str::contains($image, asset(''));

        $imagePath = $checkImageStorage ? str_replace(asset(''), '', $image) : $image;

        if (Str::contains($imagePath, 'storage/')) {
            $imagePath = str_replace('storage/', '', $imagePath);
        }

        if (Storage::disk('public')->exists($imagePath)) {
            Storage::disk('public')->delete($imagePath);
            return true;
        }

        return false;
    }
}


if (!function_exists('putImage')) {
    function putImage($folder, $image)
    {
        $imagePath = Storage::disk('public')->put($folder, $image);

        return 'storage/' . $imagePath;
    }
}

if (!function_exists('isJson')) {
    function isJson($string)
    {
        json_decode($string);
        return (json_last_error() === JSON_ERROR_NONE && is_array(json_decode($string, true)));
    }
}
