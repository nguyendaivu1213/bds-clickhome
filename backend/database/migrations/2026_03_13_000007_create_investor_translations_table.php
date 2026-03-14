<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('investor_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('investor_id')->constrained()->cascadeOnDelete();
            $table->string('locale')->index();
            $table->string('name');
            $table->text('short_description')->nullable();
            $table->longText('content')->nullable();
            
            $table->unique(['investor_id', 'locale']);
        });
    }
    public function down(): void {
        Schema::dropIfExists('investor_translations');
    }
};
