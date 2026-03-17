<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Investor;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class InvestorController extends Controller
{
    /**
     * GET /api/v1/admin/investors
     * Danh sách chủ đầu tư (kèm số lượng dự án)
     */
    public function index(Request $request): JsonResponse
    {
        $query = Investor::withTranslation()->withCount('projects');

        // Tìm kiếm theo tên (qua translation) hoặc subdomain
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('subdomain', 'like', "%{$search}%")
                  ->orWhereHas('translations', fn($t) => $t->where('name', 'like', "%{$search}%"));
            });
        }

        // Lọc theo trạng thái
        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }

        $investors = $query->latest()->paginate($request->get('per_page', 20));

        return response()->json($investors);
    }

    /**
     * POST /api/v1/admin/investors
     * Tạo mới chủ đầu tư
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'              => 'required|string|max:255',
            'subdomain'         => 'required|string|max:100|regex:/^[a-z0-9-]+$/|unique:investors,subdomain',
            'website_link'      => 'nullable|url|max:255',
            'logo'              => 'nullable|string|max:500',
            'intro_image'       => 'nullable|string|max:500',
            'footer_image'      => 'nullable|string|max:500',
            'about_image'       => 'nullable|string|max:500',
            'status'            => 'in:active,inactive',
            'short_description' => 'nullable|string|max:1000',
            'content'           => 'nullable|string',
            'stats'             => 'nullable|array',
            'benefits'          => 'nullable|array',
        ], [
            'name.required'      => 'Tên chủ đầu tư không được để trống.',
            'subdomain.required' => 'Subdomain không được để trống.',
            'subdomain.regex'    => 'Subdomain chỉ được dùng chữ thường, số và dấu gạch ngang.',
            'subdomain.unique'   => 'Subdomain này đã được sử dụng.',
            'website_link.url'   => 'Website phải là URL hợp lệ.',
        ]);

        $investor = Investor::create([
            'subdomain'    => $validated['subdomain'],
            'website_link' => $validated['website_link'] ?? null,
            'logo'         => $validated['logo'] ?? null,
            'intro_image'  => $validated['intro_image'] ?? null,
            'footer_image' => $validated['footer_image'] ?? null,
            'about_image'  => $validated['about_image'] ?? null,
            'status'       => $validated['status'] ?? 'active',
            'created_by'   => auth()->id(),
            'updated_by'   => auth()->id(),
        ]);

        // Lưu bản dịch tiếng Việt (locale mặc định)
        $investor->translateOrNew('vi')->name              = $validated['name'];
        $investor->translateOrNew('vi')->short_description = $validated['short_description'] ?? null;
        $investor->translateOrNew('vi')->content           = $validated['content'] ?? null;
        $investor->translateOrNew('vi')->stats             = $validated['stats'] ?? null;
        $investor->translateOrNew('vi')->benefits          = $validated['benefits'] ?? null;
        $investor->save();

        return response()->json(
            $investor->load('translations')->loadCount('projects'),
            201
        );
    }

    /**
     * GET /api/v1/admin/investors/{id}
     * Chi tiết một chủ đầu tư
     */
    public function show(string $id): JsonResponse
    {
        $investor = Investor::withTranslation()->withCount('projects')->findOrFail($id);
        return response()->json($investor);
    }

    /**
     * PUT/PATCH /api/v1/admin/investors/{id}
     * Cập nhật chủ đầu tư
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $investor = Investor::findOrFail($id);

        $validated = $request->validate([
            'name'              => 'sometimes|required|string|max:255',
            'subdomain'         => "sometimes|required|string|max:100|regex:/^[a-z0-9-]+$/|unique:investors,subdomain,{$id}",
            'website_link'      => 'nullable|url|max:255',
            'logo'              => 'nullable|string|max:500',
            'intro_image'       => 'nullable|string|max:500',
            'footer_image'      => 'nullable|string|max:500',
            'about_image'       => 'nullable|string|max:500',
            'status'            => 'in:active,inactive',
            'short_description' => 'nullable|string|max:1000',
            'content'           => 'nullable|string',
            'stats'             => 'nullable|array',
            'benefits'          => 'nullable|array',
        ], [
            'name.required'      => 'Tên chủ đầu tư không được để trống.',
            'subdomain.required' => 'Subdomain không được để trống.',
            'subdomain.regex'    => 'Subdomain chỉ được dùng chữ thường, số và dấu gạch ngang.',
            'subdomain.unique'   => 'Subdomain này đã được sử dụng.',
            'website_link.url'   => 'Website phải là URL hợp lệ.',
        ]);

        $updateData = ['updated_by' => auth()->id()];
        $fields = ['subdomain', 'website_link', 'logo', 'intro_image', 'footer_image', 'about_image', 'status'];
        
        foreach ($fields as $field) {
            if ($request->has($field)) {
                $updateData[$field] = $validated[$field] ?? null;
            }
        }

        $investor->update($updateData);

        // Cập nhật bản dịch
        if (isset($validated['name'])) {
            $investor->translateOrNew('vi')->name = $validated['name'];
        }
        if (array_key_exists('short_description', $validated)) {
            $investor->translateOrNew('vi')->short_description = $validated['short_description'];
        }
        if (array_key_exists('content', $validated)) {
            $investor->translateOrNew('vi')->content = $validated['content'];
        }
        if (array_key_exists('stats', $validated)) {
            $investor->translateOrNew('vi')->stats = $validated['stats'];
        }
        if (array_key_exists('benefits', $validated)) {
            $investor->translateOrNew('vi')->benefits = $validated['benefits'];
        }
        $investor->save();

        return response()->json(
            $investor->load('translations')->loadCount('projects')
        );
    }

    /**
     * DELETE /api/v1/admin/investors/{id}
     * Xóa chủ đầu tư (chỉ cho phép nếu không có dự án liên kết)
     */
    public function destroy(string $id): JsonResponse
    {
        $investor = Investor::withCount('projects')->findOrFail($id);

        if ($investor->projects_count > 0) {
            return response()->json([
                'message' => "Không thể xóa. Chủ đầu tư này đang có {$investor->projects_count} dự án liên kết.",
            ], 422);
        }

        $investor->delete();

        return response()->json(['message' => 'Xóa chủ đầu tư thành công.'], 200);
    }
}
