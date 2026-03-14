<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LanguageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Language::insert([
            ['code' => 'vi', 'name' => 'Vietnamese', 'is_default' => true, 'status' => 'active'],
            ['code' => 'en', 'name' => 'English', 'is_default' => false, 'status' => 'active'],
            ['code' => 'zh', 'name' => 'Chinese', 'is_default' => false, 'status' => 'active'],
        ]);
    }
}
