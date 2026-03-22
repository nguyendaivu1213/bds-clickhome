<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ProjectArticle;

class ProjectArticleController extends Controller
{
    public function index(Request $request)
    {
        $query = ProjectArticle::with('translations', 'project');

        if ($projectId = $request->query('project_id')) {
            $query->where('project_id', $projectId);
        }

        $articles = $query->latest()->paginate($request->query('per_page', 10));
        return response()->json($articles);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'project_id' => 'required|exists:projects,id',
            'status' => 'required|string',
        ]);

        $article = ProjectArticle::create([
            'project_id' => $request->project_id,
            'type' => $request->type ?? 'article',
            'layout_type' => $request->layout_type,
            'target_link' => $request->target_link,
            'banner_image' => $request->banner_image,
            'status' => $request->status,
            'display_order' => $request->display_order ?? 0,
        ]);

        $article->translateOrNew('vi')->fill([
            'title' => $request->title,
            'page_title' => $request->page_title,
            'summary' => $request->summary,
            'html_content' => $request->html_content,
            'slide_images' => $request->slide_images,
        ]);

        $article->save();

        return response()->json($article->load('translations', 'project'), 201);
    }

    public function show(string $id)
    {
        return response()->json(ProjectArticle::with('translations', 'project')->findOrFail($id));
    }

    public function update(Request $request, string $id)
    {
        $article = ProjectArticle::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'project_id' => 'required|exists:projects,id',
            'status' => 'required|string',
        ]);

        $article->update([
            'project_id' => $request->project_id,
            'type' => $request->type ?? $article->type,
            'layout_type' => $request->layout_type ?? $article->layout_type,
            'target_link' => $request->target_link ?? $article->target_link,
            'banner_image' => $request->banner_image,
            'status' => $request->status,
            'display_order' => $request->display_order ?? $article->display_order,
        ]);

        $article->translateOrNew('vi')->fill([
            'title' => $request->title,
            'page_title' => $request->page_title,
            'summary' => $request->summary,
            'html_content' => $request->html_content,
            'slide_images' => $request->slide_images,
        ]);

        $article->save();

        return response()->json($article->load('translations', 'project'));
    }

    public function destroy(string $id)
    {
        ProjectArticle::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
