<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->foreignId('zone_id')->nullable()->constrained('project_zones')->nullOnDelete();
            $table->string('product_type')->nullable(); // Enum: Studio, 1PN, 2PN...
            $table->string('floor')->nullable();
            $table->decimal('area', 10, 2)->nullable();
            $table->decimal('price', 15, 2)->nullable();
            $table->string('main_image')->nullable();
            $table->string('status')->default('active');
            $table->integer('display_order')->default(0);
            $table->timestamps();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
        });
    }
    public function down(): void {
        Schema::dropIfExists('properties');
    }
};
