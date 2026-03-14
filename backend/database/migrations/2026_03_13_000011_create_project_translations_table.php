<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('project_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->string('locale')->index();
            $table->string('name');
            $table->string('slogan')->nullable();
            $table->text('short_description')->nullable();
            $table->text('overview_description')->nullable();
            $table->string('url')->nullable();
            $table->string('page_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->text('meta_keywords')->nullable();
            $table->text('header_tag')->nullable();
            $table->string('location')->nullable();
            $table->string('scale')->nullable();
            $table->string('product_types')->nullable();
            $table->string('design')->nullable();
            $table->string('apartment_types')->nullable();
            $table->string('area')->nullable();
            $table->string('handover_time')->nullable();
            $table->string('legal_status')->nullable();
            $table->longText('html_content')->nullable();
            $table->longText('location_content')->nullable();
            $table->json('slide_images')->nullable();
            $table->json('map_360_links')->nullable();
            $table->json('master_plan')->nullable();
            $table->json('zone_planning')->nullable();
            $table->json('building_locations')->nullable();
            $table->json('studio_layouts')->nullable();
            $table->json('1br_layouts')->nullable();
            $table->json('2br_layouts')->nullable();
            $table->json('3br_layouts')->nullable();
            $table->json('duplex_layouts')->nullable();
            $table->json('other_layouts')->nullable();
            $table->json('amenities')->nullable();
            $table->json('handover_standards')->nullable();
            $table->json('images')->nullable();
            $table->json('videos')->nullable();
            $table->json('construction_progress')->nullable();
            
            $table->unique(['project_id', 'locale']);
        });
    }
    public function down(): void {
        Schema::dropIfExists('project_translations');
    }
};
