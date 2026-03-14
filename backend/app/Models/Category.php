<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Astrotomic\Translatable\Translatable;
use Astrotomic\Translatable\Contracts\Translatable as TranslatableContract;

class Category extends Model implements TranslatableContract
{
    use HasFactory, Translatable;

    protected $fillable = [
        'site_id', 'parent_id', 'data_type', 'display_position', 
        'template_name', 'menu_image', 'icon_image', 'is_target_blank', 'status'
    ];

    public $translatedAttributes = [
        'title', 'subtitle', 'page_title', 'description', 'content', 
        'slide_images', 'meta_description', 'meta_keywords', 'header_tag', 'url'
    ];

    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }
}
