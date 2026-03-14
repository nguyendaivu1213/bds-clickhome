<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Language extends Model
{
    protected $fillable = [
        'code',
        'name',
        'is_default',
        'status',
    ];

    public function sites()
    {
        return $this->belongsToMany(Site::class, 'site_languages')->withPivot('is_default');
    }
}
