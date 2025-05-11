<?php

namespace App\Http\Controllers;

use App\Models\RequestBook;
use Illuminate\Http\Request;

class RequestBookController extends Controller
{
 public function store(Request $request)
 {
  $validated = $request->validate([
   "book_id" => "required|exists:books,id",
  ]);

  $requestExists = RequestBook::where("user_id", auth()->id())
   ->where("book_id", $validated["book_id"])
   ->where("status", "pending")
   ->exists();

  if ($requestExists) {
   return response()->json(["message" => "Request already pending"], 409);
  }

  RequestBook::create([
   "user_id" => auth()->id(),
   "book_id" => $validated["book_id"],
   "status" => "pending",
  ]);

  return response()->json(
   [
    "message" => "Request sent successfully",
   ],
   201,
  );
 }

 public function index()
 {
  $requests = RequestBook::with(["user.student", "book"])
   ->orderBy("created_at", "desc")
   ->get();

  return response()->json($requests);
 }

 public function update(Request $request, $id)
 {
  if (auth()->user()->user_type !== "librarian") {
   return response()->json(["message" => "Unauthorized"], 403);
  }

  $requestBook = RequestBook::findOrFail($id);

  if ($requestBook->status !== "pending") {
   return response()->json(
    [
     "message" => "Request has already been processed",
    ],
    400,
   );
  }

  $validated = $request->validate([
   "status" => "required|in:approved,rejected",
  ]);

  // Only update if status is changing
  if ($requestBook->status !== $validated["status"]) {
   $requestBook->status = $validated["status"];

   // If approving, set additional fields
   if ($validated["status"] === "approved") {
    $requestBook->checked_out_at = now();
    $requestBook->due_date = now()->addDays(3); // 3 days loan period
    $requestBook->internal_status = "on_loan";
   }

   $requestBook->save();
  }

  return response()->json([
   "success" => true,
   "data" => $requestBook->load(["user.student", "book"]),
   "message" => "Request status updated successfully",
  ]);
 }
 
 
 public function getBorrowedBooks(Request $request)
{
    $user_id = auth()->id();
    $borrowedBooks = RequestBook::with("book")
        ->where("user_id", $user_id)
        ->where("status", "approved")
        ->get();

    return response()->json($borrowedBooks);
}


}
