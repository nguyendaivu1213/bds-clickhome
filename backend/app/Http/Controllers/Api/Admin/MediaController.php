<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class MediaController extends Controller
{
    protected $imageManager;

    public function __construct()
    {
        $this->imageManager = new ImageManager(new Driver());
    }

    public function index(Request $request): JsonResponse
    {
        $query = Media::query();

        if ($request->has('folder_id')) {
            if ($request->folder_id == 0) {
                $query->whereNull('folder_id');
            } else {
                $query->where('folder_id', $request->folder_id);
            }
        }

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $media = $query->latest()->paginate($request->get('per_page', 30));

        // Add full URL to each file
        $media->getCollection()->transform(function ($item) {
            $item->url = \Storage::disk('public')->url($item->original_file);
            $item->thumbnail_url = $item->thumbnail_file ? \Storage::disk('public')->url($item->thumbnail_file) : $item->url;
            $item->preview_url = $item->preview_file ? \Storage::disk('public')->url($item->preview_file) : $item->url;
            return $item;
        });

        return response()->json($media);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|max:51200', // 50MB limit
            'folder_id' => 'nullable|exists:folders,id',
        ]);

        $file = $request->file('file');
        $originalName = $file->getClientOriginalName();
        $extension = strtolower($file->getClientOriginalExtension());
        $mime = $file->getMimeType();
        $baseName = Str::slug(pathinfo($originalName, PATHINFO_FILENAME)) . '-' . time();
        
        $isImage = str_starts_with($mime, 'image/') && $extension !== 'svg';
        
        $originalPath = '';
        $previewPath = null;
        $thumbnailPath = null;

        if ($isImage) {
            // Process Image with Intervention
            $image = $this->imageManager->read($file);
            
            // 1. Save Original as WebP
            $originalFileName = $baseName . '.webp';
            $originalWebpData = $image->toWebp(90);
            Storage::disk('public')->put('media/' . $originalFileName, $originalWebpData);
            $originalPath = 'media/' . $originalFileName;

            // 2. Save Preview (Max 800px)
            $previewFileName = $baseName . '-preview.webp';
            $previewImage = clone $image;
            $previewImage->scaleDown(width: 800);
            Storage::disk('public')->put('media/' . $previewFileName, $previewImage->toWebp(80));
            $previewPath = 'media/' . $previewFileName;

            // 3. Save Thumbnail (200x200 crop)
            $thumbFileName = $baseName . '-thumb.webp';
            $thumbImage = clone $image;
            $thumbImage->cover(200, 200);
            Storage::disk('public')->put('media/' . $thumbFileName, $thumbImage->toWebp(70));
            $thumbnailPath = 'media/' . $thumbFileName;
        } else {
            // Non-image file: just store as is
            $fileName = $baseName . '.' . $extension;
            $path = $file->storeAs('media', $fileName, 'public');
            $originalPath = $path;
        }

        $media = Media::create([
            'folder_id' => $request->folder_id ?: null,
            'name' => $originalName,
            'original_file' => $originalPath,
            'file_type' => $isImage ? 'webp' : $extension,
            'file_size' => $file->getSize(),
            'thumbnail_file' => $thumbnailPath,
            'preview_file' => $previewPath,
            'status' => 'active',
            'created_by' => auth()->id(),
            'updated_by' => auth()->id(),
        ]);

        $media->url = Storage::disk('public')->url($media->original_file);
        if ($thumbnailPath) $media->thumbnail_url = Storage::disk('public')->url($thumbnailPath);
        if ($previewPath) $media->preview_url = Storage::disk('public')->url($previewPath);

        return response()->json($media, 201);
    }

    public function destroy(string $id): JsonResponse
    {
        $media = Media::findOrFail($id);
        
        // Delete all versions from storage
        if ($media->original_file) Storage::disk('public')->delete($media->original_file);
        if ($media->thumbnail_file) Storage::disk('public')->delete($media->thumbnail_file);
        if ($media->preview_file) Storage::disk('public')->delete($media->preview_file);
        
        $media->delete();
        return response()->json(['message' => 'File deleted']);
    }
}
