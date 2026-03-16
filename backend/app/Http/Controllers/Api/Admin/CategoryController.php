<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    /**
     * GET /api/v1/admin/categories
     */
    public function index(Request $request): JsonResponse
    {
        $query = Category::withTranslation();

        if ($search = $request->get('search')) {
            $query->whereHas('translations', function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%");
            });
        }

        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }

        $categories = $query->latest()->paginate($request->get('per_page', 20));

        return response()->json($categories);
    }

    /**
     * POST /api/v1/admin/categories
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title'            => 'required|string|max:255',
            'url'              => 'required|string|max:255|unique:category_translations,url',
            'data_type'        => 'nullable|string|max:50',
            'display_position' => 'nullable|string|max:50',
            'template_name'    => 'nullable|string|max:100',
            'parent_id'        => 'nullable|integer|exists:categories,id',
            'status'           => 'in:active,inactive',
            'description'      => 'nullable|string',
            'menu_image'       => 'nullable|string|max:255',
            'icon_image'       => 'nullable|string|max:255',
        ]);

        $category = Category::create([
            'site_id'          => 1,
            'parent_id'        => $validated['parent_id'] ?? null,
            'data_type'        => $validated['data_type'] ?? null,
            'display_position' => $validated['display_position'] ?? null,
            'template_name'    => $validated['template_name'] ?? null,
            'status'           => $validated['status'] ?? 'active',
            'menu_image'       => $validated['menu_image'] ?? null,
            'icon_image'       => $validated['icon_image'] ?? null,
            'created_by'       => auth()->id(),
            'updated_by'       => auth()->id(),
        ]);

        $category->translateOrNew('vi')->title = $validated['title'];
        $category->translateOrNew('vi')->url = $validated['url'];
        $category->translateOrNew('vi')->description = $validated['description'] ?? null;
        $category->save();

        return response()->json($category->load('translations'), 201);
    }

    /**
     * GET /api/v1/admin/categories/{id}
     */
    public function show(string $id): JsonResponse
    {
        $category = Category::withTranslation()->findOrFail($id);
        return response()->json($category);
    }

    /**
     * PUT/PATCH /api/v1/admin/categories/{id}
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'title'            => 'sometimes|required|string|max:255',
            'url'              => "sometimes|required|string|max:255|unique:category_translations,url,{$id},category_id",
            'data_type'        => 'nullable|string|max:50',
            'display_position' => 'nullable|string|max:50',
            'template_name'    => 'nullable|string|max:100',
            'parent_id'        => 'nullable|integer|exists:categories,id',
            'status'           => 'in:active,inactive',
            'description'      => 'nullable|string',
            'menu_image'       => 'nullable|string|max:255',
            'icon_image'       => 'nullable|string|max:255',
        ]);

        $category->update(array_merge(
            array_filter([
                'parent_id'        => $validated['parent_id'] ?? null,
                'data_type'        => $validated['data_type'] ?? null,
                'display_position' => $validated['display_position'] ?? null,
                'template_name'    => $validated['template_name'] ?? null,
                'status'           => $validated['status'] ?? null,
                'menu_image'       => $validated['menu_image'] ?? null,
                'icon_image'       => $validated['icon_image'] ?? null,
            ], fn($v) => $v !== null),
            ['updated_by' => auth()->id(), 'site_id' => 1]
        ));

        if (array_key_exists('title', $validated)) {
            $category->translateOrNew('vi')->title = $validated['title'];
        }
        if (array_key_exists('url', $validated)) {
            $category->translateOrNew('vi')->url = $validated['url'];
        }
        if (array_key_exists('description', $validated)) {
            $category->translateOrNew('vi')->description = $validated['description'];
        }
        $category->save();

        return response()->json($category->load('translations'));
    }

    /**
     * DELETE /api/v1/admin/categories/{id}
     */
    public function destroy(string $id): JsonResponse
    {
        $category = Category::findOrFail($id);
        
        // Prevent deleting if it has children
        if (Category::where('parent_id', $id)->exists()) {
            return response()->json([
                'message' => 'Không thể xóa chuyên mục đang có chứa chuyên mục con.'
            ], 422);
        }

        $category->delete();
        return response()->json(['message' => 'Xóa chuyên mục thành công.'], 200);
    }
}
