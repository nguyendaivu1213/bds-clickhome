<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('property_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->cascadeOnDelete();
            $table->string('locale')->index();
            $table->text('summary')->nullable();
            $table->longText('html_content')->nullable();
            $table->json('slide_images')->nullable();
            
            $table->unique(['property_id', 'locale']);
        });
    }
    public function down(): void {
        Schema::dropIfExists('property_translations');
    }
};
