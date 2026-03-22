<?php

namespace App\Http\Controllers\Api\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ProjectZone;

class ProjectZoneController extends Controller
{
    public function index(Request $request)
    {
        $query = ProjectZone::with('translations');

        // Filter by project_id
        if ($projectId = $request->query('project_id')) {
            $query->where('project_id', $projectId);
        }

        // Only active zones for public
        $query->where('status', 'active');

        // Order by display sequence
        $query->orderBy('display_order', 'asc');

        $zones = $query->paginate($request->query('per_page', 20));

        return response()->json($zones);
    }

    public function show($idOrSlug)
    {
        $query = ProjectZone::with('translations', 'project.translations')
            ->where('status', 'active');

        if (is_numeric($idOrSlug)) {
            $query->where('id', $idOrSlug);
        } else {
            $query->whereHas('translations', function ($q) use ($idOrSlug) {
                $q->where('slug', $idOrSlug);
            });
        }

        return response()->json($query->firstOrFail());
    }
}
