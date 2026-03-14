<?php

namespace App\Http\Controllers\Api\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
        $latestProjects = \App\Models\Project::with('translations', 'images')
            ->where('status', 'active')
            ->latest()
            ->take(6)
            ->get();

        $latestPosts = \App\Models\Post::with('translations', 'category.translations')
            ->where('status', 'published')
            ->latest('published_at')
            ->take(6)
            ->get();

        return response()->json([
            'projects' => $latestProjects,
            'posts' => $latestPosts,
        ]);
    }
}
