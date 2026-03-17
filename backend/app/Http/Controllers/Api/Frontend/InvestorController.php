<?php

namespace App\Http\Controllers\Api\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Investor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class InvestorController extends Controller
{
    public function resolve(Request $request)
    {
        $subdomain = $request->query('subdomain', '');

        $investor = null;

        if ($subdomain) {
            $investor = Investor::with('translations')
                ->where('subdomain', $subdomain)
                ->where('status', 'active')
                ->first();
        }

        if (!$investor) {
            $investor = Investor::with('translations')
                ->where('status', 'active')
                ->first();
        }

        if (!$investor) {
            return response()->json(null, 404);
        }

        return response()->json($this->formatInvestor($investor));
    }

    private function formatInvestor(Investor $investor): array
    {
        $data = $investor->toArray();

        // Flatten translation fields to root for easy frontend access
        $data['name'] = $investor->name;
        $data['short_description'] = $investor->short_description;
        $data['content'] = $investor->content;
        $data['stats'] = $investor->stats;
        $data['benefits'] = $investor->benefits;

        // Build full URLs for media fields
        foreach (['logo', 'intro_image', 'footer_image', 'about_image'] as $field) {
            if (!empty($investor->$field)) {
                $value = $investor->$field;
                // If already a full URL, use as-is
                if (str_starts_with($value, 'http://') || str_starts_with($value, 'https://')) {
                    $data[$field . '_url'] = $value;
                } else {
                    $data[$field . '_url'] = Storage::disk('public')->url($value);
                }
            } else {
                $data[$field . '_url'] = null;
            }
        }

        return $data;
    }
}
