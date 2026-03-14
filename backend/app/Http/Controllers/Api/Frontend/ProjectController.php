<?php

namespace App\Http\Controllers\Api\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $projects = \App\Models\Project::with('translations', 'images')
            ->where('status', 'active')
            ->latest()
            ->paginate(12);

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
