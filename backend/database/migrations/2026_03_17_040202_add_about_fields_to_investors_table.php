<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('investors', function (Blueprint $table) {
            $table->string('about_image')->nullable()->after('footer_image');
        });

        Schema::table('investor_translations', function (Blueprint $table) {
            $table->json('stats')->nullable()->after('content');
            $table->json('benefits')->nullable()->after('stats');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('investors', function (Blueprint $table) {
            $table->dropColumn('about_image');
        });

        Schema::table('investor_translations', function (Blueprint $table) {
            $table->dropColumn(['stats', 'benefits']);
        });
    }
};
