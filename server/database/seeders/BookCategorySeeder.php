<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\BookCategory;
use Illuminate\Database\Seeder;

class BookCategorySeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing categories
        BookCategory::truncate();

        $books = Book::all();

        // Category assignments - each book gets exactly one category
        $categoryAssignments = [
            // Fiction
            'The Great Gatsby' => 'Fiction',
            'To Kill a Mockingbird' => 'Fiction',
            '1984' => 'Dystopian',
            'Pride and Prejudice' => 'Romance',
            'The Catcher in the Rye' => 'Fiction',
            
            // Science Fiction
            'Dune' => 'Science Fiction',
            'Neuromancer' => 'Cyberpunk',
            'The Martian' => 'Science Fiction',
            'Foundation' => 'Science Fiction',
            'Ender\'s Game' => 'Science Fiction',
            
            // Fantasy
            'The Hobbit' => 'Fantasy',
            'A Game of Thrones' => 'Fantasy',
            'The Name of the Wind' => 'Fantasy',
            'The Way of Kings' => 'Fantasy',
            'American Gods' => 'Fantasy',
            
            // Mystery/Thriller
            'The Girl with the Dragon Tattoo' => 'Thriller',
            'Gone Girl' => 'Thriller',
            'The Da Vinci Code' => 'Mystery',
            'The Silent Patient' => 'Psychological Thriller',
            'Sharp Objects' => 'Thriller',
            
            // Non-Fiction
            'Sapiens: A Brief History of Humankind' => 'History',
            'Atomic Habits' => 'Self-Help',
            'Educated' => 'Memoir',
            'The Subtle Art of Not Giving a F*ck' => 'Self-Help',
            'Becoming' => 'Autobiography',
            
            // Horror
            'The Shining' => 'Horror',
            'It' => 'Horror',
            'The Exorcist' => 'Horror',
            'Bird Box' => 'Horror',
            'House of Leaves' => 'Horror'
        ];

        foreach ($books as $book) {
            if (isset($categoryAssignments[$book->title])) {
                BookCategory::create([
                    'book_id' => $book->id,
                    'name' => $categoryAssignments[$book->title]
                ]);
            }
        }
    }
}