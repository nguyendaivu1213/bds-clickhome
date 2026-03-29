<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::with('permissions')->get();
        // Cả danh sách permission để front-end render checklist
        $all_permissions = Permission::all()->pluck('name');
        return response()->json([
            'roles' => $roles,
            'all_permissions' => $all_permissions
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|unique:roles,name']);
        $role = clone new Role();
        $role->name = $request->name;
        $role->save();

        if ($request->has('permissions')) {
            $role->syncPermissions($request->permissions);
        }

        return response()->json($role->load('permissions'), 201);
    }

    public function show($id)
    {
        return response()->json(Role::with('permissions')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $role = Role::findOrFail($id);
        $request->validate(['name' => 'required|unique:roles,name,' . $role->id]);

        $role->name = $request->name;
        $role->save();

        if ($request->has('permissions')) {
            $role->syncPermissions($request->permissions);
        }

        return response()->json($role->load('permissions'));
    }

    public function destroy($id)
    {
        $role = Role::findOrFail($id);
        if ($role->name === 'Super Admin') return response()->json(['message' => 'Cannot delete Super Admin'], 403);
        $role->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
