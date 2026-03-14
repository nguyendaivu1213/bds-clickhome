<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CategoryTranslation extends Model
{
    public $timestamps = false;
    
    protected $fillable = [
        'title', 'subtitle', 'page_title', 'description', 'content', 
        'slide_images', 'meta_description', 'meta_keywords', 'header_tag', 'url'
    ];

    protected $casts = [
        'slide_images' => 'json'
    ];
}
