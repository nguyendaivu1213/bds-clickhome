<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('site_id')->constrained()->cascadeOnDelete();
            $table->foreignId('investor_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('primary_category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->string('perspective_image')->nullable();
            $table->string('footer_image')->nullable();
            $table->date('publish_date')->nullable();
            $table->text('google_map')->nullable();
            $table->string('location_image')->nullable();
            $table->string('sample_apartment_360')->nullable();
            $table->string('living_room_360')->nullable();
            $table->string('bedroom_360')->nullable();
            $table->string('balcony_360')->nullable();
            $table->string('amenities_360')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('contact_phone')->nullable();
            $table->string('status')->default('active');
            $table->integer('display_order')->default(0);
            $table->timestamps();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
        });
    }
    public function down(): void {
        Schema::dropIfExists('projects');
    }
};
