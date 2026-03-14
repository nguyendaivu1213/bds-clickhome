<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('zone_article_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('zone_article_id')->constrained()->cascadeOnDelete();
            $table->string('locale')->index();
            $table->string('title');
            $table->string('page_title')->nullable();
            $table->longText('html_content')->nullable();
            $table->json('slide_images')->nullable();
            
            $table->unique(['zone_article_id', 'locale']);
        });
    }
    public function down(): void {
        Schema::dropIfExists('zone_article_translations');
    }
};
