<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Astrotomic\Translatable\Translatable;
use Astrotomic\Translatable\Contracts\Translatable as TranslatableContract;

class Post extends Model implements TranslatableContract
{
    use Translatable;

    protected $fillable = [
        'site_id',
        'category_id',
        'author_id',
        'investor_id',
        'type',
        'slug',
        'status',
        'featured_image',
        'published_at',
    ];

    public $translatedAttributes = [
        'title', 'excerpt', 'content', 'seo_title', 'seo_description', 'seo_keywords', 'canonical_url'
    ];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    public function site()
    {
        return $this->belongsTo(Site::class);
    }

    public function investor()
    {
        return $this->belongsTo(Investor::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function translations(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(PostTranslation::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'post_tags');
    }
}
