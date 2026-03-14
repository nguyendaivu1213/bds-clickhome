<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ZoneArticleTranslation extends Model
{
    public $timestamps = false;
    
    protected $fillable = [
        'title', 'page_title', 'html_content', 'slide_images'
    ];

    protected $casts = [
        'slide_images' => 'json'
    ];
}
