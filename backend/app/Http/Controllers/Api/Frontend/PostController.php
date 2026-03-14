<?php

namespace App\Http\Controllers\Api\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $posts = \App\Models\Post::with('translations', 'category.translations')
            ->where('status', 'published')
            ->latest('published_at')
            ->paginate(12);

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
