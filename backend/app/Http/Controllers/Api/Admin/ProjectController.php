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
        return response()->json(\App\Models\Project::with('translations', 'site')->latest()->paginate(10));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'url' => 'required|string|max:255',
            'status' => 'nullable|string',
            'mainCategory' => 'nullable|integer',
            'investor' => 'nullable|integer',
            'order' => 'nullable|integer',
            'tags' => 'nullable|string',
        ]);

        $project = \App\Models\Project::create([
            'site_id' => 1,
            'investor_id' => $request->investor,
            'primary_category_id' => $request->mainCategory,
            'perspective_image' => $request->perspectiveImage,
            'footer_image' => $request->footerImage,
            'publish_date' => $request->publishDate,
            'google_map' => $request->googleMapLink,
            'location_image' => $request->location_image,
            'status' => $request->status ?? 'Planning',
            'is_published' => $request->publishedStatus === 'published',
            'display_order' => $request->order ?? 0,
            'contact_email' => $request->email,
            'contact_phone' => $request->phone,
        ]);

        $project->translateOrNew('vi')->fill([
            'name' => $request->name,
            'slogan' => $request->slogan,
            'short_description' => $request->shortDesc,
            'overview_description' => $request->fullDesc,
            'url' => $request->url,
            'page_title' => $request->seoTitle,
            'meta_description' => $request->seoDesc,
            'meta_keywords' => is_array($request->seoKeywords) ? implode(',', $request->seoKeywords) : $request->seoKeywords,
            'header_tag' => $request->seoHeader,
            'location' => $request->actualAddress,
            'scale' => $request->scale,
            'product_types' => $request->productTypes,
            'design' => $request->designUnit,
            'handover_time' => $request->handoffTime,
            'legal_status' => $request->legal,
            'slide_images' => $request->slides,
            'amenities' => $request->amenities,
            'tags' => $request->tags,
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
        
        $project->update([
            'investor_id' => $request->investor,
            'primary_category_id' => $request->mainCategory,
            'perspective_image' => $request->perspectiveImage,
            'footer_image' => $request->footerImage,
            'publish_date' => $request->publishDate,
            'google_map' => $request->googleMapLink,
            'status' => $request->status,
            'is_published' => $request->publishedStatus === 'published',
            'display_order' => $request->order,
            'contact_email' => $request->email,
            'contact_phone' => $request->phone,
        ]);

        $data = [
            'name' => $request->name,
            'slogan' => $request->slogan,
            'short_description' => $request->shortDesc,
            'overview_description' => $request->fullDesc,
            'url' => $request->url,
            'page_title' => $request->seoTitle,
            'meta_description' => $request->seoDesc,
            'meta_keywords' => is_array($request->seoKeywords) ? implode(',', $request->seoKeywords) : $request->seoKeywords,
            'header_tag' => $request->seoHeader,
            'location' => $request->actualAddress,
            'scale' => $request->scale,
            'product_types' => $request->productTypes,
            'design' => $request->designUnit,
            'handover_time' => $request->handoffTime,
            'legal_status' => $request->legal,
            'slide_images' => $request->slides,
            'amenities' => $request->amenities,
            'tags' => $request->tags,
        ];

        $project->translateOrNew('vi')->fill(array_filter($data, fn($v) => !is_null($v)));

        $project->save();

        return response()->json($project->load('translations'));
    }

    public function destroy(string $id)
    {
        \App\Models\Project::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
