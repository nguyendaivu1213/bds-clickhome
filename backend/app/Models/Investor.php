<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Astrotomic\Translatable\Translatable;
use Astrotomic\Translatable\Contracts\Translatable as TranslatableContract;

class Investor extends Model implements TranslatableContract
{
    use HasFactory, Translatable;

    protected $fillable = [
        'website_link', 'subdomain', 'logo', 'intro_image', 'footer_image', 'status'
    ];

    public $translatedAttributes = [
        'name', 'short_description', 'content'
    ];

    public function projects()
    {
        return $this->hasMany(Project::class);
    }
}
