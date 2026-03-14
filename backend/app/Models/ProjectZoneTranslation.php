<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectZoneTranslation extends Model
{
    public $timestamps = false;
    
    protected $fillable = [
        'name', 'page_title', 'slug'
    ];
}
