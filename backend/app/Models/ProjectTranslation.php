<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectTranslation extends Model
{
    public $timestamps = false;
    
    protected $fillable = [
        'name', 'slogan', 'short_description', 'overview_description', 
        'url', 'page_title', 'meta_description', 'meta_keywords', 'header_tag', 
        'location', 'location_strengths', 'real_photos', 'connections', 'scale', 'product_types', 'design', 'apartment_types', 
        'area', 'handover_time', 'legal_status', 'html_content', 'location_content', 
        'slide_images', 'map_360_links', 'master_plan', 'zone_planning', 'building_locations', 
        'studio_layouts', '1br_layouts', '2br_layouts', '3br_layouts', 'duplex_layouts', 'other_layouts', 
        'amenities', 'handover_standards', 'images', 'videos', 'construction_progress', 'tags'
    ];

    protected $casts = [
        'slide_images' => 'json',
        'real_photos' => 'json',
        'connections' => 'json',
        'map_360_links' => 'json',
        'master_plan' => 'json',
        'zone_planning' => 'json',
        'building_locations' => 'json',
        'studio_layouts' => 'json',
        '1br_layouts' => 'json',
        '2br_layouts' => 'json',
        '3br_layouts' => 'json',
        'duplex_layouts' => 'json',
        'other_layouts' => 'json',
        'amenities' => 'json',
        'handover_standards' => 'json',
        'images' => 'json',
        'videos' => 'json',
        'construction_progress' => 'json',
    ];
}
