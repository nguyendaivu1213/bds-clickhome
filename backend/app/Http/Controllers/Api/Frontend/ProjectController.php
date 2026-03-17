<?php

namespace App\Http\Controllers\Api\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $query = \App\Models\Project::with('translations')
            ->whereIn('status', ['active', 'published', 'Planning', 'Selling', 'Opening']);

        if ($request->has('investor_id')) {
            $query->where('investor_id', $request->investor_id);
        }

        $projects = $query->latest()->paginate(12);

        // Append perspective_image_url
        $projects->getCollection()->transform(function ($project) {
            if ($project->perspective_image) {
                $v = $project->perspective_image;
                $project->perspective_image_url = (str_starts_with($v, 'http') ? $v : \Storage::disk('public')->url($v));
            } else {
                $project->perspective_image_url = null;
            }
            return $project;
        });

        return response()->json($projects);
    }

    public function show($id)
    {
        // Find by ID or Slug
        $project = \App\Models\Project::with('translations', 'images')
            ->where(function ($query) use ($id) {
                $query->where('id', $id)->orWhere('slug', $id);
            })
            ->firstOrFail();

        return response()->json($project);
    }
}
