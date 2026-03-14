<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectImage extends Model
{
    protected $fillable = [
        'project_id',
        'image_url',
        'sort_order',
    ];
    
    public $timestamps = false; // No timestamps in ProjectImage migration

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
