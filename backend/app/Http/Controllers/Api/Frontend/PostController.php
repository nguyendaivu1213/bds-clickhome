<?php

namespace App\Http\Controllers\Api\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $query = \App\Models\Post::with('translations', 'category.translations')
            ->where('status', 'published');

        if ($categoryId = $request->query('category_id')) {
            $query->where('category_id', $categoryId);
        }

        if ($categorySlug = $request->query('category_slug')) {
            $query->whereHas('category', function($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
            });
        }

        $posts = $query->latest('published_at')
            ->paginate($request->query('per_page', 12));

        return response()->json($posts);
    }

    public function show($id)
    {
        // Find by ID or Slug
        $post = \App\Models\Post::with('translations', 'category.translations', 'author')
            ->where(function ($query) use ($id) {
                $query->where('id', $id)->orWhere('slug', $id);
            })
            ->firstOrFail();

        return response()->json($post);
    }
}
