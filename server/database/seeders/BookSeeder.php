<?php

namespace Database\Seeders;

use App\Models\Book;
use Illuminate\Database\Seeder;

class BookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $books = [
            [
                'title' => 'The Great Gatsby',
                'author' => 'F. Scott Fitzgerald',
                'isbn' => '9780743273565',
                'description' => 'A story of wealth, love, and the American Dream in the 1920s.',
                'quantity' => 5,
                'available' => 5,
                'user_id' => 1 // Assuming you have a user with id 1
            ],
            [
                'title' => 'To Kill a Mockingbird',
                'author' => 'Harper Lee',
                'isbn' => '9780061120084',
                'description' => 'A powerful story of racial injustice and moral growth.',
                'quantity' => 3,
                'available' => 3,
                'user_id' => 1
            ],
            // Add more books as needed
        ];

        foreach ($books as $book) {
            Book::create($book);
        }
    }
}