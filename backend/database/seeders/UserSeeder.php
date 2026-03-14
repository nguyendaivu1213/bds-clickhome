<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\User::create([
            'name' => 'Admin User',
            'email' => 'admin@clickhomes.vn',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
        ]);

        \App\Models\User::create([
            'name' => 'Writer User',
            'email' => 'writer@clickhomes.vn',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
        ]);
    }
}
