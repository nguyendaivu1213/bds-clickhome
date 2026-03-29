<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Astrotomic\Translatable\Translatable;
use Astrotomic\Translatable\Contracts\Translatable as TranslatableContract;

class ProjectArticle extends Model implements TranslatableContract
{
    use HasFactory, Translatable;

    protected $fillable = [
        'project_id', 'author_id', 'type', 'layout_type', 'target_link', 'banner_image', 'status', 'display_order'
    ];

    public $translatedAttributes = [
        'title', 'page_title', 'summary', 'html_content', 'slide_images'
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
