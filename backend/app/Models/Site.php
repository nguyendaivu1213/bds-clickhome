<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Site extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'domain', 'slug', 'theme', 'default_language', 'status'
    ];

    public function categories()
    {
        return $this->hasMany(Category::class);
    }

    public function projects()
    {
        return $this->hasMany(Project::class);
    }
}
