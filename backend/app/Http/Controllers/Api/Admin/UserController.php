<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('roles')->get();
        return response()->json($users);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
        ]);

        $user = clone new User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->save();

        if ($request->has('roles')) {
            $user->syncRoles($request->roles);
        }

        return response()->json($user, 201);
    }

    public function show($id)
    {
        $user = User::with('roles')->findOrFail($id);
        return response()->json($user);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|min:6',
        ]);

        $user->name = $request->name;
        $user->email = $request->email;
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }
        $user->save();

        if ($request->has('roles')) {
            $user->syncRoles($request->roles);
        }

        return response()->json($user);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        if ($user->id === 1 || $user->id === auth()->id()) {
            return response()->json(['message' => 'Không thể xoá tài khoản gốc hoặc chính tải khoản của bạn'], 403);
        }
        $user->delete();
        return response()->json(['message' => 'Đã xoá quản trị viên']);
    }
}
