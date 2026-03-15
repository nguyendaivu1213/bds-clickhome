<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProjectZone;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class ProjectZoneController extends Controller
{
    /**
     * GET /api/v1/admin/zones
     */
    public function index(Request $request): JsonResponse
    {
        $query = ProjectZone::with(['translations', 'project']);

        if ($search = $request->get('search')) {
            $query->whereHas('translations', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        if ($projectId = $request->get('project_id')) {
            $query->where('project_id', $projectId);
        }

        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }

        $zones = $query->orderBy('display_order', 'asc')->latest()->paginate($request->get('per_page', 20));

        return response()->json($zones);
    }

    /**
     * POST /api/v1/admin/zones
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'project_id'       => 'required|integer|exists:projects,id',
            'name'             => 'required|string|max:255',
            'page_title'       => 'nullable|string|max:255',
            'slug'             => 'nullable|string|max:255',
            'intro_image'      => 'nullable|string|max:255',
            'is_overview_page' => 'boolean',
            'status'           => 'in:active,inactive',
            'display_order'    => 'integer',
        ]);

        $zone = ProjectZone::create([
            'project_id'       => $validated['project_id'],
            'intro_image'      => $validated['intro_image'] ?? null,
            'is_overview_page' => $validated['is_overview_page'] ?? false,
            'status'           => $validated['status'] ?? 'active',
            'display_order'    => $validated['display_order'] ?? 0,
            'created_by'       => auth()->id(),
            'updated_by'       => auth()->id(),
        ]);

        $slug = $validated['slug'] ?: Str::slug($validated['name']);

        $zone->translateOrNew('vi')->name = $validated['name'];
        $zone->translateOrNew('vi')->page_title = $validated['page_title'] ?? $validated['name'];
        $zone->translateOrNew('vi')->slug = $slug;
        $zone->save();

        return response()->json($zone->load(['translations', 'project']), 201);
    }

    /**
     * GET /api/v1/admin/zones/{id}
     */
    public function show(string $id): JsonResponse
    {
        $zone = ProjectZone::with(['translations', 'project'])->findOrFail($id);
        return response()->json($zone);
    }

    /**
     * PUT/PATCH /api/v1/admin/zones/{id}
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $zone = ProjectZone::findOrFail($id);

        $validated = $request->validate([
            'project_id'       => 'sometimes|required|integer|exists:projects,id',
            'name'             => 'sometimes|required|string|max:255',
            'page_title'       => 'nullable|string|max:255',
            'slug'             => 'nullable|string|max:255',
            'intro_image'      => 'nullable|string|max:255',
            'is_overview_page' => 'boolean',
            'status'           => 'in:active,inactive',
            'display_order'    => 'integer',
        ]);

        $zone->update(array_merge(
            array_filter([
                'project_id'       => $validated['project_id'] ?? null,
                'intro_image'      => $validated['intro_image'] ?? null,
                'is_overview_page' => $validated['is_overview_page'] ?? null,
                'status'           => $validated['status'] ?? null,
                'display_order'    => $validated['display_order'] ?? null,
            ], fn($v) => $v !== null),
            ['updated_by' => auth()->id()]
        ));

        if (array_key_exists('name', $validated)) {
            $zone->translateOrNew('vi')->name = $validated['name'];
            if (!$zone->translateOrNew('vi')->slug && !($validated['slug'] ?? null)) {
                $zone->translateOrNew('vi')->slug = Str::slug($validated['name']);
            }
        }
        
        if (array_key_exists('page_title', $validated)) {
            $zone->translateOrNew('vi')->page_title = $validated['page_title'];
        }

        if (array_key_exists('slug', $validated) && $validated['slug']) {
            $zone->translateOrNew('vi')->slug = $validated['slug'];
        }

        $zone->save();

        return response()->json($zone->load(['translations', 'project']));
    }

    /**
     * DELETE /api/v1/admin/zones/{id}
     */
    public function destroy(string $id): JsonResponse
    {
        $zone = ProjectZone::findOrFail($id);
        
        // Check if it has articles or properties if needed, but for now just delete
        // if ($zone->articles()->exists() || $zone->properties()->exists()) { ... }

        $zone->delete();
        return response()->json(['message' => 'Xóa phân khu thành công.'], 200);
    }
}
