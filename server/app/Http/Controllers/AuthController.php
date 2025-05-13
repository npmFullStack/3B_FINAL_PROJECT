<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
  
  public function countUsers(Request $request)
{
    $query = User::query();
    
    if ($request->has('user_type')) {
        $query->where('user_type', $request->user_type);
    }
    
    $count = $query->count();
    return response()->json(['count' => $count]);
}
    public function register(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'id_number' => 'required|string|unique:users',
            'password' => ['required', 'confirmed', Password::defaults()],
            'course' => 'required_if:user_type,student',
            'year_level' => 'required_if:user_type,student',
            'section' => 'required_if:user_type,student',
        ]);

        // Create user
        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'id_number' => $request->id_number,
            'password' => Hash::make($request->password),
            'user_type' => 'student', // Force student registration
        ]);

        // Create student record if needed
        if ($request->has('course')) {
            $user->student()->create([
                'course' => $request->course,
                'year_level' => $request->year_level,
                'section' => $request->section,
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'student' => $user->student,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
{
    $credentials = $request->validate([
        'id_number' => 'required|string',
        'password' => 'required|string',
    ]);

    if (!Auth::attempt($credentials)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    $user = User::where('id_number', $request->id_number)->first();
    $token = $user->createToken('auth_token')->plainTextToken;

    $response = [
        'user' => $user,
        'token' => $token,
    ];

    // Only include student data if user is a student
if ($user->user_type === 'student') {
    $response['student'] = $user->student;
}

    return response()->json($response);
}

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }
    

}