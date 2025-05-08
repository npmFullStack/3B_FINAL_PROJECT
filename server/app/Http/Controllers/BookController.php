<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\BookCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BookController extends Controller
{
 public function index()
 {
  return Book::with(["user", "categories"])->get();
 }

 public function getCategories()
{
    // Get all distinct category names from book_categories table
    $existingCategories = BookCategory::select('name')
                                   ->distinct()
                                   ->orderBy('name')
                                   ->pluck('name');

    return response()->json($existingCategories);
}

 public function store(Request $request)
 {
   
   
   if (!auth()->check() || auth()->user()->user_type !== 'librarian') {
        return response()->json(['message' => 'Unauthorized'], 403);
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

   // Insert all categories at once
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
}
