<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ZoneArticle;

class ZoneArticleController extends Controller
{
    public function index(Request $request)
    {
        $query = ZoneArticle::with('translations', 'zone.project');

        if ($zoneId = $request->query('zone_id')) {
            $query->where('zone_id', $zoneId);
        }

        $articles = $query->latest()->paginate($request->query('per_page', 10));
        return response()->json($articles);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'zone_id' => 'required|exists:project_zones,id',
            'status' => 'required|string',
        ]);

        $article = ZoneArticle::create([
            'zone_id' => $request->zone_id,
            'author_id' => auth()->id() ?? 1,
            'type' => $request->type ?? 'article',
            'banner_image' => $request->banner_image,
            'status' => $request->status,
            'layout_type' => $request->layout_type,
            'target_link' => $request->target_link,
            'display_order' => $request->display_order ?? 0,
        ]);

        $article->translateOrNew('vi')->fill([
            'title' => $request->title,
            'page_title' => $request->page_title,
            'html_content' => $request->html_content,
            'slide_images' => $request->slide_images,
        ]);

        $article->save();

        return response()->json($article->load('translations', 'zone.project'), 201);
    }

    public function show(string $id)
    {
        return response()->json(ZoneArticle::with('translations', 'zone.project')->findOrFail($id));
    }

    public function update(Request $request, string $id)
    {
        $article = ZoneArticle::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'zone_id' => 'required|exists:project_zones,id',
            'status' => 'required|string',
        ]);

        $article->update([
            'zone_id' => $request->zone_id,
            'type' => $request->type ?? $article->type,
            'banner_image' => $request->banner_image,
            'status' => $request->status,
            'layout_type' => $request->layout_type ?? $article->layout_type,
            'target_link' => $request->target_link ?? $article->target_link,
            'display_order' => $request->display_order ?? $article->display_order,
        ]);

        $article->translateOrNew('vi')->fill([
            'title' => $request->title,
            'page_title' => $request->page_title,
            'html_content' => $request->html_content,
            'slide_images' => $request->slide_images,
        ]);

        $article->save();

        return response()->json($article->load('translations', 'zone.project'));
    }

    public function destroy(string $id)
    {
        ZoneArticle::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
