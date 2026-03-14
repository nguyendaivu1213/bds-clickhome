<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('category_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->string('locale')->index();
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->string('page_title')->nullable();
            $table->text('description')->nullable();
            $table->longText('content')->nullable();
            $table->json('slide_images')->nullable();
            $table->text('meta_description')->nullable();
            $table->text('meta_keywords')->nullable();
            $table->text('header_tag')->nullable();
            $table->string('url')->nullable();
            
            $table->unique(['category_id', 'locale']);
        });
    }
    public function down(): void {
        Schema::dropIfExists('category_translations');
    }
};
