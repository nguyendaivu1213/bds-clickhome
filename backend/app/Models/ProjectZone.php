<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Astrotomic\Translatable\Translatable;
use Astrotomic\Translatable\Contracts\Translatable as TranslatableContract;

class ProjectZone extends Model implements TranslatableContract
{
    use HasFactory, Translatable;

    protected $fillable = [
        'project_id', 'intro_image', 'is_overview_page', 'status', 'display_order'
    ];

    public $translatedAttributes = [
        'name', 'page_title', 'slug'
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function articles()
    {
        return $this->hasMany(ZoneArticle::class, 'zone_id');
    }

    public function properties()
    {
        return $this->hasMany(Property::class, 'zone_id');
    }
}
