<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(\App\Models\Project::with('translations', 'images', 'site')->latest()->paginate(10));
    }

    public function store(Request $request)
    {
        $project = \App\Models\Project::create($request->all());
        return response()->json($project, 201);
    }

    public function show(string $id)
    {
        return response()->json(\App\Models\Project::with('translations', 'images')->findOrFail($id));
    }

    public function update(Request $request, string $id)
    {
        $project = \App\Models\Project::findOrFail($id);
        $project->update($request->all());
        return response()->json($project);
    }

    public function destroy(string $id)
    {
        \App\Models\Project::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
