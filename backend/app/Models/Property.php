<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Astrotomic\Translatable\Translatable;
use Astrotomic\Translatable\Contracts\Translatable as TranslatableContract;

class Property extends Model implements TranslatableContract
{
    use HasFactory, Translatable;

    protected $fillable = [
        'project_id', 'zone_id', 'product_type', 'floor', 'area', 
        'price', 'main_image', 'status', 'display_order'
    ];

    public $translatedAttributes = [
        'summary', 'html_content', 'slide_images'
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function zone()
    {
        return $this->belongsTo(ProjectZone::class, 'zone_id');
    }
}
