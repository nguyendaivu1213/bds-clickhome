<?php

namespace App\Http\Controllers\Api\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ZoneArticle;

class ZoneArticleController extends Controller
{
    public function index(Request $request)
    {
        $query = ZoneArticle::with('translations', 'zone.translations');

        // Filter by zone_id
        if ($zoneId = $request->query('zone_id')) {
            $query->where('zone_id', $zoneId);
        }

        if ($type = $request->query('type')) {
            $query->where('type', $type);
        }

        // Only active articles for public
        $query->where('status', 'published');

        // Order by display sequence
        $query->orderBy('display_order', 'asc')->latest();

        $articles = $query->paginate($request->query('per_page', 20));

        return response()->json($articles);
    }

    public function show($id)
    {
        $article = ZoneArticle::with('translations', 'zone.translations')
            ->where('status', 'published')
            ->findOrFail($id);

        return response()->json($article);
    }
}
