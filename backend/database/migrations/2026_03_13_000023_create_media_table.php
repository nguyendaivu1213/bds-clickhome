<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('media', function (Blueprint $table) {
            $table->id();
            $table->foreignId('folder_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('original_file');
            $table->string('file_type')->nullable(); // ext
            $table->string('thumbnail_file')->nullable();
            $table->string('preview_file')->nullable();
            $table->unsignedBigInteger('file_size')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
        });
    }
    public function down(): void {
        Schema::dropIfExists('media');
    }
};
