<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PropertyTranslation extends Model
{
    public $timestamps = false;
    
    protected $fillable = [
        'name', 'summary', 'html_content', 'slide_images'
    ];

    protected $casts = [
        'slide_images' => 'json'
    ];
}
