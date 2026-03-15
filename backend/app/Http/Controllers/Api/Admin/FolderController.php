<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Folder;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class FolderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        if ($request->get('view') === 'tree') {
            $folders = Folder::whereNull('parent_id')
                ->with(['children' => function($query) {
                    $query->withCount(['children', 'media']);
                }])
                ->withCount(['children', 'media'])
                ->get();
            return response()->json($folders);
        }

        $query = Folder::query();
        
        if ($request->has('parent_id')) {
            if ($request->parent_id == 0) {
                $query->whereNull('parent_id');
            } else {
                $query->where('parent_id', $request->parent_id);
            }
        } else {
            // Default to root level if no parent_id is specified
            $query->whereNull('parent_id');
        }

        $folders = $query->withCount(['children', 'media'])->get();
        return response()->json($folders);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:folders,id',
        ]);

        $folder = Folder::create([
            'name' => $validated['name'],
            'parent_id' => $validated['parent_id'],
            'status' => 'active',
        ]);

        return response()->json($folder, 201);
    }

    public function update(Request $request, Folder $folder): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $folder->update($validated);
        return response()->json($folder);
    }

    public function destroy(Folder $folder): JsonResponse
    {
        // Delete child folders and media recursively if needed, 
        // but for now just prevent if children exist.
        if ($folder->children()->exists() || $folder->media()->exists()) {
            return response()->json(['message' => 'Folder is not empty'], 422);
        }

        $folder->delete();
        return response()->json(['message' => 'Folder deleted']);
    }
}
