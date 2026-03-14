<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sitemap extends Model
{
    protected $fillable = [
        'site_id',
        'language_id',
        'url',
        'last_generated',
    ];

    protected $casts = [
        'last_generated' => 'datetime',
    ];

    public function site()
    {
        return $this->belongsTo(Site::class);
    }

    public function language()
    {
        return $this->belongsTo(Language::class);
    }
}
