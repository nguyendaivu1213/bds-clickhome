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
        Schema::table('projects', function (Blueprint $table) {
            $table->boolean('is_published')->default(false)->after('status');
        });

        Schema::table('project_translations', function (Blueprint $table) {
            $table->text('tags')->nullable()->after('overview_description');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn('is_published');
        });

        Schema::table('project_translations', function (Blueprint $table) {
            $table->dropColumn('tags');
        });
    }
};
