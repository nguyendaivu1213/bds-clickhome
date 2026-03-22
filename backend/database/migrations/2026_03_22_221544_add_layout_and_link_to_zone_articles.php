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
        Schema::table('zone_articles', function (Blueprint $table) {
            if (!Schema::hasColumn('zone_articles', 'layout_type')) {
                $table->string('layout_type')->nullable()->after('type');
            }
            if (!Schema::hasColumn('zone_articles', 'target_link')) {
                $table->string('target_link')->nullable()->after('layout_type');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('zone_articles', function (Blueprint $table) {
            $table->dropColumn(['layout_type', 'target_link']);
        });
    }
};
