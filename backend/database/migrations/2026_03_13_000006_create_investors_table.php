<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('investors', function (Blueprint $table) {
            $table->id();
            $table->string('website_link')->nullable();
            $table->string('subdomain')->nullable();
            $table->string('logo')->nullable();
            $table->string('intro_image')->nullable();
            $table->string('footer_image')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
        });
    }
    public function down(): void {
        Schema::dropIfExists('investors');
    }
};
