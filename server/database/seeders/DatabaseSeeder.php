<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        

        $this->call([
            LibrarianSeeder::class,
            // Other seeders (e.g., BooksSeeder, StudentsSeeder)...
        ]);
    }
}
