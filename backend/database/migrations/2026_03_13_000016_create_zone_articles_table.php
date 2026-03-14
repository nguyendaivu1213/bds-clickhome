<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('zone_articles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('zone_id')->constrained('project_zones')->cascadeOnDelete();
            $table->string('type')->nullable();
            $table->string('banner_image')->nullable();
            $table->string('status')->default('active');
            $table->integer('display_order')->default(0);
            $table->timestamps();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
        });
    }
    public function down(): void {
        Schema::dropIfExists('zone_articles');
    }
};
