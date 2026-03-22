<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. First, handle any existing null 'url' values by generating a default slug from the project name
        $translations = DB::table('project_translations')->whereNull('url')->get();
        foreach ($translations as $translation) {
            $slug = \Illuminate\Support\Str::slug($translation->name) ?: 'project-' . $translation->project_id;
            
            // Ensure uniqueness of the generated slug
            $originalSlug = $slug;
            $counter = 1;
            while (DB::table('project_translations')->where('url', $slug)->exists()) {
                $slug = $originalSlug . '-' . $counter++;
            }
            
            DB::table('project_translations')
                ->where('id', $translation->id)
                ->update(['url' => $slug]);
        }

        // 1b. Handle existing non-null duplicates
        $duplicates = DB::table('project_translations')
            ->select('url', DB::raw('count(*) as count'))
            ->whereNotNull('url')
            ->groupBy('url')
            ->having('count', '>', 1)
            ->get();

        foreach ($duplicates as $duplicate) {
            $items = DB::table('project_translations')
                ->where('url', $duplicate->url)
                ->orderBy('id')
                ->get();
            
            // Keep the first one, update the rest
            for ($i = 1; $i < count($items); $i++) {
                $newSlug = $items[$i]->url . '-' . $i;
                
                // Ensure the new slug is also unique
                $counter = $i + 1;
                while (DB::table('project_translations')->where('url', $newSlug)->exists()) {
                    $newSlug = $items[$i]->url . '-' . $counter++;
                }

                DB::table('project_translations')
                    ->where('id', $items[$i]->id)
                    ->update(['url' => $newSlug]);
            }
        }

        Schema::table('project_translations', function (Blueprint $table) {
            // 2. Make url NOT NULL
            $table->string('url')->nullable(false)->change();
            
            // 3. Add unique index
            $table->unique('url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('project_translations', function (Blueprint $table) {
            $table->dropUnique(['url']);
            $table->string('url')->nullable()->change();
        });
    }
};
