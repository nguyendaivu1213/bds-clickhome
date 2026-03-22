<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

$duplicates = DB::table('project_translations')
    ->select('url', DB::raw('count(*) as count'))
    ->whereNotNull('url')
    ->groupBy('url')
    ->having('count', '>', 1)
    ->get();

echo "Duplicate URLs:\n";
foreach ($duplicates as $duplicate) {
    echo "URL: {$duplicate->url}, Count: {$duplicate->count}\n";
    $items = DB::table('project_translations')->where('url', $duplicate->url)->get();
    foreach ($items as $item) {
        echo "  ID: {$item->id}, Project ID: {$item->project_id}, Name: {$item->name}\n";
    }
}
