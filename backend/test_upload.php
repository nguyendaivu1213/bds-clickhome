<?php
require 'vendor/autoload.php';
// Boot Laravel
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Media;
use Illuminate\Http\UploadedFile;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

try {
    echo "Testing Image Processing...\n";
    $imageManager = new ImageManager(new Driver());
    
    // Create a dummy image
    $tempFile = tempnam(sys_get_temp_dir(), 'test_img');
    $imgData = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==');
    file_put_contents($tempFile, $imgData);
    
    $file = new UploadedFile($tempFile, 'test.png', 'image/png', null, true);
    
    $originalName = $file->getClientOriginalName();
    $extension = 'png';
    $mime = 'image/png';
    $baseName = 'test-' . time();
    
    $image = $imageManager->read($file);
    echo "Image read successfully.\n";
    
    $originalWebpData = $image->toWebp(90);
    echo "Converted to WebP.\n";
    
    Storage::disk('public')->put('media/' . $baseName . '.webp', $originalWebpData);
    echo "Saved to storage.\n";
    
    $media = Media::create([
        'name' => $originalName,
        'original_file' => 'media/' . $baseName . '.webp',
        'file_type' => 'webp',
        'file_size' => $file->getSize(),
        'status' => 'active',
    ]);
    echo "Database record created. ID: " . $media->id . "\n";
    
    unlink($tempFile);
    echo "SUCCESS\n";
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
}
