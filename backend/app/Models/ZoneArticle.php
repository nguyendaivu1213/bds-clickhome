<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Astrotomic\Translatable\Translatable;
use Astrotomic\Translatable\Contracts\Translatable as TranslatableContract;

class ZoneArticle extends Model implements TranslatableContract
{
    use HasFactory, Translatable;

    protected $fillable = [
        'zone_id', 'type', 'banner_image', 'status', 'display_order'
    ];

    public $translatedAttributes = [
        'title', 'page_title', 'html_content', 'slide_images'
    ];

    public function zone()
    {
        return $this->belongsTo(ProjectZone::class, 'zone_id');
    }
}
