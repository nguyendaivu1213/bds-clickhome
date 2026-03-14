<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Language;
use App\Models\Site;
use App\Models\Category;
use App\Models\Investor;
use App\Models\Project;
use App\Models\SiteSetting;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Disable foreign key checks for testing
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        // Clear tables
        User::truncate();
        Language::truncate();
        Site::truncate();
        SiteSetting::truncate();
        Investor::truncate();
        Category::truncate();
        Project::truncate();
        
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 1. TẠO USER ADMIN
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@clickhomes.vn',
            'password' => Hash::make('12345678'),
            'role' => 'admin',
            'status' => 'active'
        ]);

        // 2. TẠO LANGUAGES
        Language::create(['code' => 'vi', 'name' => 'Vietnamese', 'is_default' => true]);
        Language::create(['code' => 'en', 'name' => 'English', 'is_default' => false]);

        // 3. TẠO SITE
        $site = Site::create([
            'name' => 'ClickHomes',
            'domain' => 'clickhomes.vn',
            'slug' => 'clickhomes',
            'default_language' => 'vi',
            'status' => 'active'
        ]);

        SiteSetting::create([
            'site_id' => $site->id, 
            'key' => 'logo',
            'value' => '/images/logo.png'
        ]);

        // 4. TẠO INVESTOR (Đa ngôn ngữ)
        $investor = new Investor();
        $investor->website_link = 'https://vinholnes.com';
        $investor->subdomain = 'vinhome';
        $investor->status = 'active';
        $investor->save(); // Lưu bản ghi gốc trước
        
        $investor->translateOrNew('vi')->name = 'Tập đoàn ABC';
        $investor->translateOrNew('vi')->short_description = 'Nhà phát triển BDS hàng đầu.';
        $investor->translateOrNew('en')->name = 'ABC Group';
        $investor->translateOrNew('en')->short_description = 'Leading Real Estate Developer.';
        $investor->save();

        // 5. TẠO CATEGORIES (Đa ngôn ngữ)
        $catProject = new Category();
        $catProject->site_id = $site->id;
        $catProject->data_type = 'Dự án';
        $catProject->status = 'active';
        $catProject->save();

        $catProject->translateOrNew('vi')->title = 'Danh mục Dự án';
        $catProject->translateOrNew('vi')->url = 'du-an';
        $catProject->translateOrNew('en')->title = 'Projects Category';
        $catProject->translateOrNew('en')->url = 'projects';
        $catProject->save();

        // 6. TẠO PROJECT (Đa ngôn ngữ)
        $project1 = new Project();
        $project1->site_id = $site->id;
        $project1->investor_id = $investor->id;
        $project1->primary_category_id = $catProject->id;
        $project1->perspective_image = '/images/project1.jpg';
        $project1->status = 'active';
        $project1->save();

        $project1->translateOrNew('vi')->name = 'The Privia Hưng Thịnh';
        $project1->translateOrNew('vi')->slogan = 'Tinh hoa cuộc sống';
        $project1->translateOrNew('vi')->short_description = 'Dự án căn hộ cao cấp tại Bình Tân';
        $project1->translateOrNew('vi')->location = 'Quận Bình Tân, TP.HCM';
        $project1->translateOrNew('vi')->url = 'the-privia-hung-thinh';
        $project1->translateOrNew('vi')->product_types = 'Căn hộ chung cư';
        $project1->translateOrNew('vi')->slide_images = json_decode('[{"image":"1.jpg", "title":"Tổng quan"}, {"image":"2.jpg", "title":"Phối cảnh"}]', true);
        
        $project1->translateOrNew('en')->name = 'The Privia by Hung Thinh';
        $project1->translateOrNew('en')->slogan = 'Essence of Life';
        $project1->translateOrNew('en')->short_description = 'Luxury apartment project in Binh Tan';
        $project1->translateOrNew('en')->location = 'Binh Tan District, HCMC';
        $project1->translateOrNew('en')->url = 'the-privia-by-hung-thinh';
        $project1->translateOrNew('en')->product_types = 'Apartment';
        $project1->translateOrNew('en')->slide_images = json_decode('[{"image":"1.jpg", "title":"Overview"}, {"image":"2.jpg", "title":"Perspective"}]', true);
        $project1->save();

        echo "Seeding completed successfully with Database_v2 architecture.\n";
    }
}
