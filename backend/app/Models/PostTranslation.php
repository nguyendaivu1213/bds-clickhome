<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostTranslation extends Model
{
    protected $fillable = [
        'post_id',
        'locale',
        'title',
        'excerpt',
        'content',
        'seo_title',
        'seo_description',
        'seo_keywords',
        'canonical_url',
    ];

    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}
