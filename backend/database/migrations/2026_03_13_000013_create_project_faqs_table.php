<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('project_faqs', function (Blueprint $table) {
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->foreignId('faq_id')->constrained()->cascadeOnDelete();
            $table->primary(['project_id', 'faq_id']);
        });
    }
    public function down(): void {
        Schema::dropIfExists('project_faqs');
    }
};
