<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('project_zone_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_zone_id')->constrained()->cascadeOnDelete();
            $table->string('locale')->index();
            $table->string('name');
            $table->string('page_title')->nullable();
            $table->string('slug')->nullable();
            
            $table->unique(['project_zone_id', 'locale']);
        });
    }
    public function down(): void {
        Schema::dropIfExists('project_zone_translations');
    }
};
