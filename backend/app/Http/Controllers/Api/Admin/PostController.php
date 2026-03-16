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
        $data = $request->all();
        $data['site_id'] = 1;
        $post = \App\Models\Post::create($data);
        return response()->json($post, 201);
    }

    public function show(string $id)
    {
        return response()->json(\App\Models\Post::with('translations', 'category')->findOrFail($id));
    }

    public function update(Request $request, string $id)
    {
        $post = \App\Models\Post::findOrFail($id);
        $post->update($request->all());
        return response()->json($post);
    }

    public function destroy(string $id)
    {
        \App\Models\Post::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
