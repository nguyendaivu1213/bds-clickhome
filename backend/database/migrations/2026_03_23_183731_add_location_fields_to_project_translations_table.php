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
        Schema::table('project_translations', function (Blueprint $table) {
            $table->text('location_strengths')->nullable()->after('location');
            $table->json('real_photos')->nullable()->after('location_strengths');
            $table->json('connections')->nullable()->after('real_photos');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('project_translations', function (Blueprint $table) {
            $table->dropColumn(['location_strengths', 'real_photos', 'connections']);
        });
    }
};
