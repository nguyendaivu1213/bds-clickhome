<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index()
    {
        // Always return settings for site_id 1
        $rows = SiteSetting::where('site_id', 1)->get();

        $result = [];
        foreach ($rows as $row) {
            $key   = $row->key;
            $value = $row->value;

            // Try to decode JSON. If successful, use the decoded value.
            $decoded = json_decode($value, true);
            $result[$key] = (json_last_error() === JSON_ERROR_NONE) ? $decoded : $value;
        }

        return response()->json($result);
    }

    public function store(Request $request)
    {
        $payload = $request->all();

        foreach ($payload as $key => $value) {
            $valToStore = is_array($value)
                ? json_encode($value, JSON_UNESCAPED_UNICODE)
                : (string) $value;

            SiteSetting::updateOrCreate(
                ['site_id' => 1, 'key' => $key],
                ['value'   => $valToStore]
            );
        }

        return response()->json(['message' => 'Cài đặt đã được lưu thành công.']);
    }
}
