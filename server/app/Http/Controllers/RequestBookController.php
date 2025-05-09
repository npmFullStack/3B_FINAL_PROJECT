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

    // Check for existing pending request
    $requestExists = RequestBook::where('user_id', auth()->id())
        ->where('book_id', $validated['book_id'])
        ->where('status', 'pending')
        ->exists();

    if ($requestExists) {
        return response()->json(['message' => 'Request already pending'], 409);
    }

    RequestBook::create([
        'user_id' => auth()->id(),
        'book_id' => $validated['book_id'],
        'status' => 'pending',
        // No due_date set yet (will be set when approved)
    ]);

    return response()->json([
        'message' => 'Request sent successfully'
    ], 201);
}

public function update(Request $request, RequestBook $requestBook)
{
    try {
        $validated = $request->validate([
            'status' => 'required|in:pending,approved,rejected'
        ]);

        $requestBook->status = $validated['status'];
        
        if ($validated['status'] === 'approved') {
            $requestBook->due_date = now()->addDays(3);
            $requestBook->checked_out_at = now();
            $requestBook->internal_status = 'on_loan';
        }

        $requestBook->save();

        return response()->json([
            'success' => true,
            'data' => $requestBook
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Update failed',
            'error' => $e->getMessage()
        ], 500);
    }
}

 public function index()
 {
  $requests = RequestBook::with(["user.student", "book"])
   ->orderBy("created_at", "desc")
   ->get();

  return response()->json($requests);
 }

 public function returnBook(RequestBook $requestBook)
 {
  $fineAmount = 0;

  if ($requestBook->due_date && now()->gt($requestBook->due_date)) {
   $daysLate = now()->diffInDays($requestBook->due_date);
   $fineAmount = $daysLate * 10; // $10 per day late

   // Create fine record
   Fine::create([
    "request_id" => $requestBook->id,
    "amount" => $fineAmount,
    "reason" => "late_return",
    "status" => "pending",
   ]);
  }

  $requestBook->update(["status" => "returned"]);

  return response()->json([
   "message" => "Book marked as returned",
   "fine" => $fineAmount > 0 ? ["amount" => $fineAmount] : null,
  ]);
 }
}
