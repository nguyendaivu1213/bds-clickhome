<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostView extends Model
{
    protected $fillable = [
        'post_id',
        'views',
        'date',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}
