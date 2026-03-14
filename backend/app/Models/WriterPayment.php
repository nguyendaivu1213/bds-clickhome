<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WriterPayment extends Model
{
    protected $fillable = [
        'post_id',
        'user_id',
        'word_count',
        'price',
        'status',
    ];

    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
