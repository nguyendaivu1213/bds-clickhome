<?php

namespace App\Http\Controllers\Api\Frontend;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    /**
     * Return a subset of settings safe for public consumption.
     * Only expose non-sensitive keys (logo, site name, contact info, etc.)
     */
    public function public()
    {
        $allowedKeys = [
            'logo', 'site_name', 'tagline', 'address',
            'phone', 'email', 'support_email', 'facebook', 'youtube',
            'zalo', 'hotline', 'copyright',
        ];

        $rows = SiteSetting::where('site_id', 1)
            ->whereIn('key', $allowedKeys)
            ->get();

        $result = [];
        foreach ($rows as $row) {
            $key   = $row->key;
            $value = $row->value;

            // Decode JSON arrays; keep strings as-is
            $decoded = json_decode($value, true);
            $result[$key] = (json_last_error() === JSON_ERROR_NONE && is_array($decoded))
                ? $decoded
                : $value;
        }

        // Ensure logo is a full URL
        if (!empty($result['logo'])) {
            $logo = $result['logo'];
            if (!str_starts_with($logo, 'http')) {
                $result['logo'] = Storage::disk('public')->url($logo);
            }
        }

        return response()->json($result);
    }
}
