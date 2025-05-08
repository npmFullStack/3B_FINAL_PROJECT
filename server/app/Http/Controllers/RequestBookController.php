<?php

namespace App\Http\Controllers;

use App\Models\RequestBook;
use Illuminate\Http\Request;

class RequestBookController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'book_id' => 'required|exists:books,id',
        ]);

        $requestExists = RequestBook::where('user_id', auth()->id())
            ->where('book_id', $validated['book_id'])
            ->where('status', 'pending') // Using string literal
            ->exists();

        if ($requestExists) {
            return response()->json(['message' => 'Request already pending'], 409);
        }

        $requestBook = RequestBook::create([
            'user_id' => auth()->id(),
            'book_id' => $validated['book_id'],
            'status' => 'pending', // Using string literal
        ]);

        return response()->json([
            'message' => 'Request sent successfully',
            'request' => $requestBook,
        ], 201);
    }
    
    
    public function index()
    {
        $requests = RequestBook::with(['user.student', 'book'])
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($requests);
    }

public function update(Request $request, RequestBook $requestBook)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,approved,rejected'
        ]);

        $requestBook->update(['status' => $validated['status']]);
        
        return response()->json([
            'message' => 'Request updated successfully',
            'request' => $requestBook
        ]);
    }
}