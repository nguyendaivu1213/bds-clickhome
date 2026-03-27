<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PropertyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Property::with(['project', 'zone']);

        if ($request->filled('project_id')) {
            $query->where('project_id', $request->project_id);
        }

        if ($request->filled('zone_id')) {
            $query->where('zone_id', $request->zone_id);
        }

        if ($request->filled('product_type')) {
            $query->where('product_type', $request->product_type);
        }

        // Search by product code
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('product_code', 'like', "%{$search}%");
        }

        // Sort by id descending by default
        $query->orderBy('id', 'desc');

        $perPage = $request->input('per_page', 10);
        return response()->json($query->paginate($perPage));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'zone_id' => 'nullable|exists:project_zones,id',
            'product_code' => 'nullable|string|max:255|unique:properties,product_code',
            'product_type' => 'nullable|string|max:255',
            'floor' => 'nullable|string|max:50',
            'area' => 'nullable|numeric',
            'price' => 'nullable|numeric',
            'main_image' => 'nullable|string',
            'video_url' => 'nullable|string',
            'status' => 'required|string|in:active,inactive,sold,available',
            'display_order' => 'integer|default:0',
            
            // Translated fields
            'en.name' => 'nullable|string',
            'en.summary' => 'nullable|string',
            'en.html_content' => 'nullable|string',
            'en.slide_images' => 'nullable|array',
            'vi.name' => 'nullable|string',
            'vi.summary' => 'nullable|string',
            'vi.html_content' => 'nullable|string',
            'vi.slide_images' => 'nullable|array',
        ]);

        try {
            DB::beginTransaction();
            
            $data = $request->except(['vi', 'en']);
            
            $property = new Property($data);
            
            // Add translation data
            foreach (['vi', 'en'] as $locale) {
                if ($request->has($locale)) {
                    foreach ($request->input($locale) as $key => $value) {
                         $property->translateOrNew($locale)->{$key} = $value;
                    }
                }
            }
            
            $property->save();
            DB::commit();

            return response()->json([
                'message' => 'Property created successfully',
                'data' => $property->load(['project', 'zone'])
            ], 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Property Create Error: ' . $e->getMessage() . "\n" . $e->getTraceAsString());
            return response()->json(['message' => 'Lỗi lưu sản phẩm: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $property = Property::with(['project', 'zone'])->findOrFail($id);
        
        // Load translations so the frontend can populate the form
        $property->translations;
        
        return response()->json($property);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $property = Property::findOrFail($id);

        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'zone_id' => 'nullable|exists:project_zones,id',
            'product_code' => 'nullable|string|max:255|unique:properties,product_code,' . $property->id,
            'product_type' => 'nullable|string|max:255',
            'floor' => 'nullable|string|max:50',
            'area' => 'nullable|numeric',
            'price' => 'nullable|numeric',
            'main_image' => 'nullable|string',
            'video_url' => 'nullable|string',
            'status' => 'required|string',
            'display_order' => 'integer',
            
            // Translated fields
            'en.name' => 'nullable|string',
            'en.summary' => 'nullable|string',
            'en.html_content' => 'nullable|string',
            'en.slide_images' => 'nullable|array',
            'vi.name' => 'nullable|string',
            'vi.summary' => 'nullable|string',
            'vi.html_content' => 'nullable|string',
            'vi.slide_images' => 'nullable|array',
        ]);

        try {
            DB::beginTransaction();

            $data = $request->except(['vi', 'en']);
            $property->update($data);

            foreach (['vi', 'en'] as $locale) {
                if ($request->has($locale)) {
                    // Update or create translation
                    $translation = $property->translateOrNew($locale);
                    foreach ($request->input($locale) as $key => $value) {
                         $translation->{$key} = $value;
                    }
                }
            }
            
            $property->save();
            DB::commit();

            return response()->json([
                'message' => 'Property updated successfully',
                'data' => $property->load(['project', 'zone'])
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Lỗi cập nhật sản phẩm: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $property = Property::findOrFail($id);
        $property->delete();

        return response()->json(['message' => 'Property deleted successfully']);
    }
}
