<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SiteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $site = \App\Models\Site::create([
            'name' => 'ClickHomes',
            'domain' => 'clickhomes.vn',
            'slug' => 'clickhomes',
            'theme' => 'default',
            'default_language' => 'vi',
            'status' => 'active',
        ]);

        $vi = \App\Models\Language::where('code', 'vi')->first();
        $en = \App\Models\Language::where('code', 'en')->first();

        $site->languages()->attach([
            $vi->id => ['is_default' => true],
            $en->id => ['is_default' => false],
        ]);
    }
}
