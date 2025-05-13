<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\BookCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BookController extends Controller
{
  
  public function count()
{
    $count = Book::where('status', 1)->count();
    return response()->json(['count' => $count]);
}
 public function index()
 {
  return Book::with(["user", "categories"])
   ->where("status", 1)
   ->get();
 }

 public function getCategories()
{
    return BookCategory::select("name")
        ->distinct()
        ->orderBy("name")
        ->pluck("name");
}

 public function store(Request $request)
 {
  if (!auth()->check() || auth()->user()->user_type !== "librarian") {
   return response()->json(["message" => "Unauthorized"], 403);
  }

  $validated = $request->validate([
   "title" => "required|string|max:255",
   "author" => "required|string|max:255",
   "categories" => "required|array|min:1",
   "categories.*" => "string|max:255",
   "isbn" => "nullable|string|unique:books",
   "quantity" => "required|integer|min:1",
   "description" => "nullable|string",
   "image" => "nullable|image|max:2048",
  ]);

  return DB::transaction(function () use ($validated, $request) {
   // Create the book
   $book = Book::create([
    "title" => $validated["title"],
    "author" => $validated["author"],
    "isbn" => $validated["isbn"] ?? null,
    "quantity" => $validated["quantity"],
    "available" => $validated["quantity"],
    "description" => $validated["description"] ?? null,
    "user_id" => auth()->id(),
    "image_path" => $request->hasFile("image")
     ? $request->file("image")->store("book-covers", "public")
     : null,
   ]);

   // Process categories - only attach existing ones
   $categories = collect($validated["categories"])
    ->unique()
    ->filter()
    ->map(function ($categoryName) use ($book) {
     return [
      "book_id" => $book->id,
      "name" => $categoryName,
      "created_at" => now(),
      "updated_at" => now(),
     ];
    });

   BookCategory::insert($categories->toArray());

   return response()->json(
    [
     "book" => $book->load("categories"),
     "message" => "Book added successfully",
    ],
    201,
   );
  });
 }

 public function show($id)
 {
  return Book::with("categories")->findOrFail($id);
 }

 public function update(Request $request, $id)
 {
  if (!auth()->check() || auth()->user()->user_type !== "librarian") {
   return response()->json(["message" => "Unauthorized"], 403);
  }

  $validated = $request->validate([
   "title" => "required|string|max:255",
   "author" => "required|string|max:255",
   "categories" => "required|array|min:1",
   "categories.*" => "string|max:255|exists:book_categories,name",
   "isbn" => "nullable|string|unique:books,isbn," . $id,
   "quantity" => "required|integer|min:1",
   "description" => "nullable|string",
   "image" => "nullable|image|max:2048",
  ]);

  return DB::transaction(function () use ($validated, $request, $id) {
   $book = Book::findOrFail($id);

   // Update the book
   $book->update([
    "title" => $validated["title"],
    "author" => $validated["author"],
    "isbn" => $validated["isbn"] ?? null,
    "quantity" => $validated["quantity"],
    "available" =>
     $validated["quantity"] - ($book->quantity - $book->available),
    "description" => $validated["description"] ?? null,
    "image_path" => $request->hasFile("image")
     ? $request->file("image")->store("book-covers", "public")
     : $book->image_path,
   ]);

   // Process categories
   $categories = collect($validated["categories"])
    ->unique()
    ->filter()
    ->map(function ($categoryName) use ($book) {
     return [
      "book_id" => $book->id,
      "name" => $categoryName,
      "created_at" => now(),
      "updated_at" => now(),
     ];
    });

   if ($categories->isEmpty()) {
    throw new \Exception("At least one category is required");
   }

   // Delete old categories and insert new ones
   BookCategory::where("book_id", $book->id)->delete();
   BookCategory::insert($categories->toArray());

   return response()->json(
    [
     "book" => $book->load("categories"),
     "message" => "Book updated successfully",
    ],
    200,
   );
  });
 }

 public function destroy($id)
 {
  if (!auth()->check() || auth()->user()->user_type !== "librarian") {
   return response()->json(["message" => "Unauthorized"], 403);
  }

  $book = Book::findOrFail($id);
  $book->status = 0;
  $book->save();

  return response()->json(
   [
    "message" => "Book deleted successfully",
   ],
   200,
  );
 }
}
