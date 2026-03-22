<?php

namespace App\Http\Controllers\Api\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ProjectArticle;
use App\Models\Project;
use Illuminate\Support\Facades\Storage;

class ProjectArticleController extends Controller
{
    public function index(Request $request)
    {
        $query = ProjectArticle::with('translations', 'project.translations')
            ->where('status', 'published');

        if ($request->has('investor_id')) {
            $projectIds = Project::where('investor_id', $request->investor_id)->pluck('id')->toArray();
            $query->whereIn('project_id', $projectIds);
        }

        if ($request->has('project_id')) {
            $query->where('project_id', $request->project_id);
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        $perPage = $request->query('per_page', 6);
        $articles = $query->latest()->paginate($perPage);

        // Append banner_image_url
        $articles->getCollection()->transform(function ($article) {
            if ($article->banner_image) {
                $v = $article->banner_image;
                $article->banner_image_url = (str_starts_with($v, 'http') ? $v : Storage::disk('public')->url($v));
            } else {
                $article->banner_image_url = null;
            }
            return $article;
        });

        return response()->json($articles);
    }

    public function show($id)
    {
        $article = ProjectArticle::with('translations', 'project.translations')
            ->where('status', 'published')
            ->findOrFail($id);
            
        if ($article->banner_image) {
            $v = $article->banner_image;
            $article->banner_image_url = (str_starts_with($v, 'http') ? $v : Storage::disk('public')->url($v));
        }

        return response()->json($article);
    }
}
