<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(\App\Models\Post::with('translations', 'category', 'site', 'author')->latest()->paginate(10));
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'status' => 'required|in:published,draft',
            'slug' => 'required|string',
        ]);

        $data = $request->except(['title', 'excerpt', 'content']);
        $data['site_id'] = 1;
        $data['author_id'] = auth()->id() ?? 1;

        $slug = $request->slug;
        $exists = \App\Models\Post::where('slug', $slug)->exists();
        
        if ($exists) {
            // Temporarily use unique slug to avoid constraint error
            $data['slug'] = $slug . '-' . time();
        }

        $post = \App\Models\Post::create($data);
        
        if ($exists) {
            // Now append the ID as requested
            $post->slug = $slug . '-' . $post->id;
            $post->save();
        }
        
        $post->translateOrNew('vi')->fill([
            'title' => $request->title,
            'excerpt' => $request->excerpt,
            'content' => $request->content,
            'seo_title' => $request->seo_title,
            'seo_description' => $request->seo_description,
            'seo_keywords' => $request->seo_keywords,
        ]);
        
        $post->save();

        return response()->json($post->load('translations'), 201);
    }

    public function show(string $id)
    {
        return response()->json(\App\Models\Post::with('translations', 'category', 'author')->findOrFail($id));
    }

    public function update(Request $request, string $id)
    {
        $post = \App\Models\Post::findOrFail($id);
        
        $request->validate([
            'title' => 'required|string|max:255',
            'status' => 'required|in:published,draft',
            'slug' => 'required|string',
        ]);

        $slug = $request->slug;
        $exists = \App\Models\Post::where('slug', $slug)->where('id', '!=', $id)->exists();
        
        $data = $request->except(['title', 'excerpt', 'content']);
        if ($exists) {
            $data['slug'] = $slug . '-' . $id;
        }

        $post->update($data);
        
        $post->translateOrNew('vi')->fill([
            'title' => $request->title,
            'excerpt' => $request->excerpt,
            'content' => $request->content,
            'seo_title' => $request->seo_title,
            'seo_description' => $request->seo_description,
            'seo_keywords' => $request->seo_keywords,
        ]);
        
        $post->save();

        return response()->json($post->load('translations'));
    }

    public function destroy(string $id)
    {
        \App\Models\Post::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
