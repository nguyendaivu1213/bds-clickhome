<?php

namespace App\Http\Controllers\Api\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PropertyController extends Controller
{
    public function index(Request $request)
    {
        $query = Property::with(['project', 'zone', 'translations']);

        if ($request->filled('project_id')) {
            $query->where('project_id', $request->project_id);
        }

        if ($request->filled('zone_id')) {
            $query->where('zone_id', $request->zone_id);
        }

        if ($request->filled('product_type')) {
            $query->where('product_type', $request->product_type);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $query->orderBy('display_order', 'asc')->orderBy('id', 'asc');

        $perPage = $request->input('per_page', 20);
        $properties = $query->paginate($perPage);

        // Append main_image_url for each property
        $properties->getCollection()->transform(function ($property) {
            if ($property->main_image) {
                $img = $property->main_image;
                $property->main_image_url = (str_starts_with($img, 'http') ? $img : \Storage::disk('public')->url($img));
            } else {
                $property->main_image_url = null;
            }

            // Expose translated name
            $property->setAttribute('name', $property->name);
            $property->setAttribute('summary', $property->summary);

            return $property;
        });

        return response()->json($properties);
    }
}
