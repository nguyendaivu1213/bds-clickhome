<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    use HasFactory;

    protected $fillable = [
        'folder_id', 'name', 'original_file', 'file_type', 
        'thumbnail_file', 'preview_file', 'file_size', 'status'
    ];

    public function folder()
    {
        return $this->belongsTo(Folder::class);
    }
}
