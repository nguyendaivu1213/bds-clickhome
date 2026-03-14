<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Media::query();

        if ($request->has('folder_id')) {
            $query->where('folder_id', $request->folder_id);
        }

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $media = $query->latest()->paginate($request->get('per_page', 30));

        // Add full URL to each file
        $media->getCollection()->transform(function ($item) {
            $item->url = Storage::disk('public')->url($item->original_file);
            $item->thumbnail_url = $item->thumbnail_file ? Storage::disk('public')->url($item->thumbnail_file) : $item->url;
            return $item;
        });

        return response()->json($media);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|image|max:10240', // 10MB limit
            'folder_id' => 'nullable|exists:folders,id',
        ]);

        $file = $request->file('file');
        $originalName = $file->getClientOriginalName();
        $extension = $file->getClientOriginalExtension();
        $fileName = Str::slug(pathinfo($originalName, PATHINFO_FILENAME)) . '-' . time() . '.' . $extension;
        
        $path = $file->storeAs('media', $fileName, 'public');

        $media = Media::create([
            'folder_id' => $request->folder_id,
            'name' => $originalName,
            'original_file' => 'media/' . $fileName, // Store relative to public storage
            'file_type' => $extension,
            'file_size' => $file->getSize(),
            'status' => 'active',
        ]);

        $media->url = Storage::disk('public')->url($media->original_file);

        return response()->json($media, 201);
    }

    public function destroy(Media $media): JsonResponse
    {
        // Delete from storage
        Storage::disk('public')->delete($media->original_file);
        
        $media->delete();
        return response()->json(['message' => 'File deleted']);
    }
}
