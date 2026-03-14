<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectArticleTranslation extends Model
{
    public $timestamps = false;
    
    protected $fillable = [
        'title', 'page_title', 'summary', 'html_content', 'slide_images'
    ];

    protected $casts = [
        'slide_images' => 'json'
    ];
}
