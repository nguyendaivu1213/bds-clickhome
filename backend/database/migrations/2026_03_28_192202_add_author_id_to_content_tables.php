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
        $tables = ['posts', 'projects', 'project_articles', 'zone_articles'];
        
        foreach ($tables as $table) {
            Schema::table($table, function (Blueprint $table) {
                if (!Schema::hasColumn($table->getTable(), 'author_id')) {
                    $table->unsignedBigInteger('author_id')->nullable()->after('id');
                    $table->foreign('author_id')->references('id')->on('users')->nullOnDelete();
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tables = ['posts', 'projects', 'project_articles', 'zone_articles'];
        
        foreach ($tables as $table) {
            Schema::table($table, function (Blueprint $table) {
                if (Schema::hasColumn($table->getTable(), 'author_id')) {
                    $table->dropForeign(['author_id']);
                    $table->dropColumn('author_id');
                }
            });
        }
    }
};
