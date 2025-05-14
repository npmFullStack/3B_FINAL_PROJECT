<?php

namespace Database\Seeders;

use App\Models\Book;
use Illuminate\Database\Seeder;

class BookSeeder extends Seeder
{
    public function run(): void
    {
        $books = [
            // Fiction Classics
            [
                'title' => 'The Great Gatsby',
                'author' => 'F. Scott Fitzgerald',
                'isbn' => '9780743273565',
                'description' => 'A story of wealth, love, and the American Dream in the 1920s.',
                'quantity' => 5,
                'available' => 5,
                'user_id' => 1
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
            // Continue with additional books
            [
                'title' => 'The Catcher in the Rye',
                'author' => 'J.D. Salinger',
                'isbn' => '9780316769488',
                'description' => 'A story about teenage rebellion and alienation.',
                'quantity' => 2,
                'available' => 2,
                'user_id' => 1
            ],
            [
                'title' => '1984',
                'author' => 'George Orwell',
                'isbn' => '9780451524935',
                'description' => 'A dystopian novel about totalitarianism and surveillance.',
                'quantity' => 4,
                'available' => 4,
                'user_id' => 1
            ],
            [
                'title' => 'Pride and Prejudice',
                'author' => 'Jane Austen',
                'isbn' => '9780141439518',
                'description' => 'A romantic novel about the Bennet family in rural England.',
                'quantity' => 3,
                'available' => 3,
                'user_id' => 1
            ],
            // Science Fiction
            [
                'title' => 'Dune',
                'author' => 'Frank Herbert',
                'isbn' => '9780441172719',
                'description' => 'A science fiction epic about desert planet Arrakis.',
                'quantity' => 4,
                'available' => 4,
                'user_id' => 1
            ],
            [
                'title' => 'Neuromancer',
                'author' => 'William Gibson',
                'isbn' => '9780441569595',
                'description' => 'The novel that defined the cyberpunk genre.',
                'quantity' => 3,
                'available' => 3,
                'user_id' => 1
            ],
            [
                'title' => 'The Martian',
                'author' => 'Andy Weir',
                'isbn' => '9780553418026',
                'description' => 'An astronaut must survive alone on Mars after being left behind.',
                'quantity' => 5,
                'available' => 5,
                'user_id' => 1
            ],
            [
                'title' => 'Foundation',
                'author' => 'Isaac Asimov',
                'isbn' => '9780553293357',
                'description' => 'A saga of a Galactic Empire and its predicted fall.',
                'quantity' => 3,
                'available' => 3,
                'user_id' => 1
            ],
            [
                'title' => 'Ender\'s Game',
                'author' => 'Orson Scott Card',
                'isbn' => '9780812550702',
                'description' => 'A young boy is trained to fight in an interstellar war.',
                'quantity' => 4,
                'available' => 4,
                'user_id' => 1
            ],
            // Fantasy
            [
                'title' => 'The Hobbit',
                'author' => 'J.R.R. Tolkien',
                'isbn' => '9780547928227',
                'description' => 'A fantasy adventure about Bilbo Baggins and his quest.',
                'quantity' => 5,
                'available' => 5,
                'user_id' => 1
            ],
            [
                'title' => 'A Game of Thrones',
                'author' => 'George R.R. Martin',
                'isbn' => '9780553103540',
                'description' => 'The first book in the epic A Song of Ice and Fire series.',
                'quantity' => 4,
                'available' => 4,
                'user_id' => 1
            ],
            [
                'title' => 'The Name of the Wind',
                'author' => 'Patrick Rothfuss',
                'isbn' => '9780756404741',
                'description' => 'The story of Kvothe, an adventurer and musician.',
                'quantity' => 3,
                'available' => 3,
                'user_id' => 1
            ],
            [
                'title' => 'The Way of Kings',
                'author' => 'Brandon Sanderson',
                'isbn' => '9780765326355',
                'description' => 'First book in the Stormlight Archive epic fantasy series.',
                'quantity' => 4,
                'available' => 4,
                'user_id' => 1
            ],
            [
                'title' => 'American Gods',
                'author' => 'Neil Gaiman',
                'isbn' => '9780062059888',
                'description' => 'A novel about gods living in modern America.',
                'quantity' => 3,
                'available' => 3,
                'user_id' => 1
            ],
            // Mystery/Thriller
            [
                'title' => 'The Girl with the Dragon Tattoo',
                'author' => 'Stieg Larsson',
                'isbn' => '9780307269751',
                'description' => 'A journalist and hacker investigate a decades-old disappearance.',
                'quantity' => 4,
                'available' => 4,
                'user_id' => 1
            ],
            [
                'title' => 'Gone Girl',
                'author' => 'Gillian Flynn',
                'isbn' => '9780307588364',
                'description' => 'A psychological thriller about a missing wife.',
                'quantity' => 3,
                'available' => 3,
                'user_id' => 1
            ],
            [
                'title' => 'The Da Vinci Code',
                'author' => 'Dan Brown',
                'isbn' => '9780307474278',
                'description' => 'A symbologist uncovers a religious mystery.',
                'quantity' => 5,
                'available' => 5,
                'user_id' => 1
            ],
            [
                'title' => 'The Silent Patient',
                'author' => 'Alex Michaelides',
                'isbn' => '9781250301697',
                'description' => 'A psychological thriller about a woman who shoots her husband.',
                'quantity' => 3,
                'available' => 3,
                'user_id' => 1
            ],
            [
                'title' => 'Sharp Objects',
                'author' => 'Gillian Flynn',
                'isbn' => '9780307341556',
                'description' => 'A reporter returns to her hometown to cover a murder.',
                'quantity' => 2,
                'available' => 2,
                'user_id' => 1
            ],
            // Non-Fiction
            [
                'title' => 'Sapiens: A Brief History of Humankind',
                'author' => 'Yuval Noah Harari',
                'isbn' => '9780062316097',
                'description' => 'Explores the history of human evolution and civilization.',
                'quantity' => 4,
                'available' => 4,
                'user_id' => 1
            ],
            [
                'title' => 'Atomic Habits',
                'author' => 'James Clear',
                'isbn' => '9780735211292',
                'description' => 'A guide to building good habits and breaking bad ones.',
                'quantity' => 5,
                'available' => 5,
                'user_id' => 1
            ],
            [
                'title' => 'Educated',
                'author' => 'Tara Westover',
                'isbn' => '9780399590504',
                'description' => 'A memoir about a woman who leaves her survivalist family.',
                'quantity' => 3,
                'available' => 3,
                'user_id' => 1
            ],
            [
                'title' => 'The Subtle Art of Not Giving a F*ck',
                'author' => 'Mark Manson',
                'isbn' => '9780062457714',
                'description' => 'A counterintuitive approach to living a good life.',
                'quantity' => 4,
                'available' => 4,
                'user_id' => 1
            ],
            [
                'title' => 'Becoming',
                'author' => 'Michelle Obama',
                'isbn' => '9781524763138',
                'description' => 'Memoir by the former First Lady of the United States.',
                'quantity' => 3,
                'available' => 3,
                'user_id' => 1
            ],
            // Horror
            [
                'title' => 'The Shining',
                'author' => 'Stephen King',
                'isbn' => '9780307743657',
                'description' => 'A family becomes the winter caretakers of an isolated hotel.',
                'quantity' => 4,
                'available' => 4,
                'user_id' => 1
            ],
            [
                'title' => 'It',
                'author' => 'Stephen King',
                'isbn' => '9781501142970',
                'description' => 'Seven adults return to their hometown to confront a nightmare.',
                'quantity' => 3,
                'available' => 3,
                'user_id' => 1
            ],
            [
                'title' => 'The Exorcist',
                'author' => 'William Peter Blatty',
                'isbn' => '9780061007224',
                'description' => 'A novel about the demonic possession of a young girl.',
                'quantity' => 2,
                'available' => 2,
                'user_id' => 1
            ],
            [
                'title' => 'Bird Box',
                'author' => 'Josh Malerman',
                'isbn' => '9780062259653',
                'description' => 'A woman must navigate a post-apocalyptic world blindfolded.',
                'quantity' => 3,
                'available' => 3,
                'user_id' => 1
            ],
            [
                'title' => 'House of Leaves',
                'author' => 'Mark Z. Danielewski',
                'isbn' => '9780385603102',
                'description' => 'A mind-bending horror novel about a house that\'s bigger inside.',
                'quantity' => 2,
                'available' => 2,
                'user_id' => 1
            ]
        ];

        foreach ($books as $book) {
            Book::create($book);
        }
    }
}