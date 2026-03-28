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
        $project = \App\Models\Project::with('translations')
            ->where(function ($query) use ($id) {
                $query->where('projects.id', $id)
                      ->orWhereTranslation('url', $id);
            })
            ->firstOrFail();

        // Ensure translated attributes are present for JSON
        $project->setAttribute('name', $project->name);
        $project->setAttribute('slogan', $project->slogan);
        $project->setAttribute('short_description', $project->short_description);
        $project->setAttribute('scale', $project->scale);
        // Map DB column names to frontend-expected names
        $project->setAttribute('handoff_time', $project->handover_time);
        $project->setAttribute('legal', $project->legal_status);

        // Append perspective_image_url
        if ($project->perspective_image) {
            $v = $project->perspective_image;
            $project->perspective_image_url = (str_starts_with($v, 'http') ? $v : \Storage::disk('public')->url($v));
        } else {
            $project->perspective_image_url = null;
        }

        // Transform slide_images URLs
        if (is_array($project->slide_images)) {
            $slides = $project->slide_images;
            foreach ($slides as &$slide) {
                if (isset($slide['image']) && $slide['image']) {
                    $img = $slide['image'];
                    $slide['image_url'] = (str_starts_with($img, 'http') ? $img : \Storage::disk('public')->url($img));
                }
            }
            $project->setAttribute('slide_images', $slides);
        }

        return response()->json($project);
    }
}
