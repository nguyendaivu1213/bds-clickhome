<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Astrotomic\Translatable\Translatable;
use Astrotomic\Translatable\Contracts\Translatable as TranslatableContract;

class Faq extends Model implements TranslatableContract
{
    use HasFactory, Translatable;

    protected $fillable = [
        'status'
    ];

    public $translatedAttributes = [
        'question', 'answer'
    ];

    public function projects()
    {
        return $this->belongsToMany(Project::class, 'project_faqs');
    }
}
