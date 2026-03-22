<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

$translations = DB::table('project_translations')->get();

echo "Project Slugs:\n";
foreach ($translations as $translation) {
    echo "Project {$translation->project_id}: {$translation->url}\n";
}
