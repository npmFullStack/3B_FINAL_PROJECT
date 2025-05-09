<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\RequestBookController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public routes
Route::get('/categories', [BookController::class, 'getCategories']);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    // Authentication
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Book management
    Route::post('/add-book', [BookController::class, 'store']);
    Route::get('/books', [BookController::class, 'index']);
    
    Route::post('/request-book', [RequestBookController::class, 'store']);
    
Route::get('/requests', [RequestBookController::class, 'index']); // Get all requests
Route::put('/requests/{request}', [RequestBookController::class, 'update']); // Update status

Route::post('/requests/{request}/return', [RequestBookController::class, 'returnBook']);

});

Route::fallback(function() {
    return response()->json([
        'message' => 'API endpoint not found'
    ], 404);
});