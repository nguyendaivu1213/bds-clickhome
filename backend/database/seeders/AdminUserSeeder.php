<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = \App\Models\User::firstOrNew(['name' => 'admin']);
        $admin->email = 'admin@clickhome.vn';
        $admin->password = \Illuminate\Support\Facades\Hash::make('AbC!456');
        $admin->save();
    }
}
