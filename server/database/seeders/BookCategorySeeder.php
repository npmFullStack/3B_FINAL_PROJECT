<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\BookCategory;
use Illuminate\Database\Seeder;

class BookCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Fiction',
            'Non-Fiction',
            'Science Fiction',
            'Fantasy',
            'Mystery',
            'Thriller',
            'Romance',
            'Horror',
            'Biography',
            'History'
        ];

        // Get all books to associate categories with
        $books = Book::all();

        foreach ($books as $book) {
            // Assign 2-3 random categories to each book
            $randomCategories = array_rand(array_flip($categories), rand(2, 3));
            
            foreach ((array)$randomCategories as $categoryName) {
                BookCategory::create([
                    'book_id' => $book->id,
                    'name' => $categoryName
                ]);
            }
        }
    }
}