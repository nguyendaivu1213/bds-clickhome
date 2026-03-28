<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Astrotomic\Translatable\Translatable;
use Astrotomic\Translatable\Contracts\Translatable as TranslatableContract;

class Project extends Model implements TranslatableContract
{
    use HasFactory, Translatable;

    protected $fillable = [
        'site_id', 'investor_id', 'primary_category_id', 
        'perspective_image', 'footer_image', 'banner_type', 'publish_date', 
        'google_map', 'latitude', 'longitude', 'location_image', 
        'sample_apartment_360', 'living_room_360', 'bedroom_360', 'balcony_360', 'amenities_360',
        'contact_email', 'contact_phone', 'status', 'is_published', 'display_order', 'youtube_link'
    ];

    public $translatedAttributes = [
        'name', 'slogan', 'short_description', 'overview_description', 
        'url', 'page_title', 'meta_description', 'meta_keywords', 'header_tag', 
        'location', 'location_strengths', 'real_photos', 'connections', 'scale', 'product_types', 'design', 'apartment_types', 
        'area', 'handover_time', 'legal_status', 'html_content', 'location_content', 
        'slide_images', 'map_360_links', 'master_plan', 'zone_planning', 'building_locations', 
        'studio_layouts', '1br_layouts', '2br_layouts', '3br_layouts', 'duplex_layouts', 'other_layouts', 
        'amenities', 'handover_standards', 'images', 'videos', 'construction_progress', 'tags'
    ];

    protected $appends = ['slug'];

    public function getSlugAttribute() {
        return $this->url;
    }

    public function site()
    {
        return $this->belongsTo(Site::class);
    }

    public function investor()
    {
        return $this->belongsTo(Investor::class);
    }

    public function primaryCategory()
    {
        return $this->belongsTo(Category::class, 'primary_category_id');
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'project_category');
    }

    public function faqs()
    {
        return $this->belongsToMany(Faq::class, 'project_faqs');
    }

    public function zones()
    {
        return $this->hasMany(ProjectZone::class);
    }

    public function articles()
    {
        return $this->hasMany(ProjectArticle::class);
    }

    public function properties()
    {
        return $this->hasMany(Property::class);
    }
}
