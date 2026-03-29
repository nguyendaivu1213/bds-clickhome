<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = \App\Models\Project::with('translations', 'site');

        // Lọc theo search (tên dự án)
        if ($search = $request->get('search')) {
            $query->whereHas('translations', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        // Lọc theo chủ đầu tư
        if ($investorId = $request->get('investor_id')) {
            $query->where('investor_id', $investorId);
        }

        // Lọc theo trạng thái công khai
        if ($request->has('is_published') && $request->get('is_published') !== 'all') {
            $query->where('is_published', $request->get('is_published') === 'published');
        }

        // Sắp xếp theo ngày giờ cập nhật mới nhất
        $query->orderBy('updated_at', 'desc');

        $projects = $query->paginate($request->get('per_page', 20));

        return response()->json($projects);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'url' => 'required|string|max:255|unique:project_translations,url',
            'status' => 'nullable|string',
            'mainCategory' => 'nullable|integer',
            'investor' => 'nullable|integer',
            'order' => 'nullable|integer',
            'tags' => 'nullable|string',
        ], [
            'name.required' => 'Tên dự án không được để trống.',
            'url.required' => 'Đường dẫn dự án không được để trống.',
            'url.unique' => 'Đường dẫn dự án đã tồn tại, vui lòng chọn đường dẫn khác.',
        ]);

        $project = \App\Models\Project::create([
            'site_id' => 1,
            'author_id' => auth()->id() ?? 1,
            'investor_id' => $request->investor,
            'primary_category_id' => $request->mainCategory,
            'perspective_image' => $request->perspectiveImage,
            'footer_image' => $request->footerImage,
            'banner_type' => $request->bannerType ?? 'full_banner',
            'publish_date' => $request->publishDate,
            'google_map' => $request->googleMapLink,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'location_image' => $request->location_image,
            'status' => $request->status ?? 'Planning',
            'is_published' => $request->publishedStatus === 'published',
            'display_order' => $request->order ?? 0,
            'contact_email' => $request->email,
            'contact_phone' => $request->phone,
            'youtube_link' => $request->youtube_link,
        ]);

        $project->translateOrNew('vi')->fill([
            'name' => $request->name,
            'slogan' => $request->slogan,
            'short_description' => $request->shortDesc,
            'overview_description' => $request->fullDesc,
            'html_content' => $request->htmlContent,
            'product_short_desc' => $request->productShortDesc,
            'product_long_desc' => $request->productLongDesc,
            'overview_specs' => is_array($request->overviewSpecs) ? $request->overviewSpecs : null,
            'url' => $request->url,
            'page_title' => $request->seoTitle,
            'meta_description' => $request->seoDesc,
            'meta_keywords' => is_array($request->seoKeywords) ? implode(',', $request->seoKeywords) : $request->seoKeywords,
            'header_tag' => $request->seoHeader,
            'location' => $request->actualAddress,
            'location_strengths' => $request->locationStrengths,
            'real_photos' => $request->realPhotos,
            'connections' => $request->connections,
            'scale' => $request->scale,
            'product_types' => $request->productTypes,
            'design' => $request->designUnit,
            'handover_time' => $request->handoffTime,
            'legal_status' => $request->legal,
            'slide_images' => $request->slides,
            'amenities' => $request->amenities,
            'tags' => $request->tags,
            'map_360_links' => $request->tour360,
            'master_plan' => $request->masterPlan,
            'other_layouts' => $request->unitLayouts,
            'construction_progress' => $request->progressHistory,
        ]);
        
        $project->save();

        return response()->json($project->load('translations'), 201);
    }

    public function show(string $id)
    {
        return response()->json(\App\Models\Project::with('translations', 'site', 'primaryCategory')->findOrFail($id));
    }

    public function update(Request $request, string $id)
    {
        $project = \App\Models\Project::findOrFail($id);
        
        $request->validate([
            'name' => 'required|string|max:255',
            'url' => 'required|string|max:255|unique:project_translations,url,' . $id . ',project_id',
        ], [
            'name.required' => 'Tên dự án không được để trống.',
            'url.required' => 'Đường dẫn dự án không được để trống.',
            'url.unique' => 'Đường dẫn dự án đã tồn tại, vui lòng chọn đường dẫn khác.',
        ]);
        
        $project->update([
            'investor_id' => $request->investor,
            'primary_category_id' => $request->mainCategory,
            'perspective_image' => $request->perspectiveImage,
            'footer_image' => $request->footerImage,
            'banner_type' => $request->bannerType ?? 'full_banner',
            'publish_date' => $request->publishDate,
            'google_map' => $request->googleMapLink,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'status' => $request->status,
            'is_published' => $request->publishedStatus === 'published',
            'display_order' => $request->order,
            'contact_email' => $request->email,
            'contact_phone' => $request->phone,
            'youtube_link' => $request->youtube_link,
        ]);

        $data = [
            'name' => $request->name,
            'slogan' => $request->slogan,
            'short_description' => $request->shortDesc,
            'overview_description' => $request->fullDesc,
            'html_content' => $request->htmlContent,
            'product_short_desc' => $request->productShortDesc,
            'product_long_desc' => $request->productLongDesc,
            'overview_specs' => is_array($request->overviewSpecs) ? $request->overviewSpecs : null,
            'url' => $request->url,
            'page_title' => $request->seoTitle,
            'meta_description' => $request->seoDesc,
            'meta_keywords' => is_array($request->seoKeywords) ? implode(',', $request->seoKeywords) : $request->seoKeywords,
            'header_tag' => $request->seoHeader,
            'location' => $request->actualAddress,
            'location_strengths' => $request->locationStrengths,
            'real_photos' => $request->realPhotos,
            'connections' => $request->connections,
            'scale' => $request->scale,
            'product_types' => $request->productTypes,
            'design' => $request->designUnit,
            'handover_time' => $request->handoffTime,
            'legal_status' => $request->legal,
            'slide_images' => $request->slides,
            'amenities' => $request->amenities,
            'tags' => $request->tags,
            'map_360_links' => $request->tour360,
            'master_plan' => $request->masterPlan,
            'other_layouts' => $request->unitLayouts,
            'construction_progress' => $request->progressHistory,
        ];

        $project->translateOrNew('vi')->fill($data);

        $project->save();

        return response()->json($project->load('translations'));
    }

    public function destroy(string $id)
    {
        \App\Models\Project::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
