<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InvestorTranslation extends Model
{
    public $timestamps = false;
    
    protected $fillable = [
        'name', 'short_description', 'content', 'stats', 'benefits'
    ];

    protected $casts = [
        'stats' => 'array',
        'benefits' => 'array',
    ];
}
